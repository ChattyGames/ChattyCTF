'use strict';
// Vercel Node function. Database credentials never leave this server.
const crypto=require('node:crypto');
const ANSWERS=require('../server/answers.json');
const TTL=90*24*60*60;
const RATE_SCRIPT=`local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n`;
const JOIN_SCRIPT=`
if redis.call('HLEN',KEYS[2])>=200 then return 0 end
redis.call('HSET',KEYS[2],ARGV[1],ARGV[2])
redis.call('SET',KEYS[1],ARGV[1],'EX',ARGV[3])
redis.call('EXPIRE',KEYS[2],ARGV[3])
return 1`;
const SOLVE_SCRIPT=`
local raw=redis.call('HGET',KEYS[1],ARGV[1])
if not raw then return false end
local player=cjson.decode(raw)
for _,id in ipairs(player.solved) do
 if id==ARGV[2] then return raw end
end
table.insert(player.solved,ARGV[2])
local updated=cjson.encode(player)
redis.call('HSET',KEYS[1],ARGV[1],updated)
redis.call('EXPIRE',KEYS[1],ARGV[3])
return updated`;
function safeError(status,message){const e=new Error(message);e.status=status;return e;}
async function redis(command){
 const url=(process.env.UPSTASH_REDIS_REST_URL||process.env.KV_REST_API_URL),token=(process.env.UPSTASH_REDIS_REST_TOKEN||process.env.KV_REST_API_TOKEN);
 if(!url||!token)throw safeError(503,'The class leaderboard is not connected yet. You can keep practicing.');
 const response=await fetch(url.replace(/\/$/,''),{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(command),signal:AbortSignal.timeout(8000)});
 if(!response.ok)throw safeError(503,'The leaderboard is temporarily unavailable. Your practice progress is still here.');
 const data=await response.json();if(data.error)throw safeError(503,'The leaderboard is temporarily unavailable. Try again shortly.');return data.result;
}
function getPrefix(){const board=process.env.CTF_BOARD_ID||'moss-class';if(!/^[a-zA-Z0-9_-]{1,40}$/.test(board))throw safeError(503,'Moss needs to finish the leaderboard setup.');return 'ghost-runner:v1:'+board+':';}
function sessionKey(prefix,token){return prefix+'session:'+crypto.createHash('sha256').update(token).digest('hex');}
function playerView(raw){const p=typeof raw==='string'?JSON.parse(raw):raw;return {id:p.id,initials:p.initials,solved:Array.isArray(p.solved)?p.solved.filter(id=>Object.hasOwn(ANSWERS,id)):[]};}
async function authenticate(req,prefix){const auth=req.headers.authorization||'';const token=auth.startsWith('Bearer ')?auth.slice(7):'';if(!/^[a-zA-Z0-9_-]{43}$/.test(token))throw safeError(401,'Join the board or restore your private recovery code.');const id=await redis(['GET',sessionKey(prefix,token)]);if(!id)throw safeError(401,'This shift could not be restored. Check your recovery code or start a new shift.');return id;}
async function rateLimit(req,prefix,action){
 // Generous per-IP limits allow an entire classroom behind school NAT.
 const ip=String(req.headers['x-forwarded-for']||'unknown').split(',')[0].trim();
 const hash=crypto.createHash('sha256').update(ip).digest('hex').slice(0,20);
 const limit=action==='join'?120:1200,seconds=action==='join'?600:60;
 const count=await redis(['EVAL',RATE_SCRIPT,'1',prefix+'rate:'+action+':'+hash,String(seconds)]);
 if(Number(count)>limit)throw safeError(429,'A lot of requests arrived at once. Wait a minute and try again.');
}
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 try{
  const prefix=getPrefix(),players=prefix+'players';
  if(!(process.env.UPSTASH_REDIS_REST_URL||process.env.KV_REST_API_URL)||!(process.env.UPSTASH_REDIS_REST_TOKEN||process.env.KV_REST_API_TOKEN))throw safeError(503,'The class leaderboard is not connected yet. You can keep practicing.');
  if(req.method==='GET'){
   await rateLimit(req,prefix,'read');
   const rows=(await redis(['HVALS',players])||[]).map(playerView);
   rows.sort((a,b)=>b.solved.length-a.solved.length||a.initials.localeCompare(b.initials)||a.id.localeCompare(b.id));
   let rank=0,last=-1;const ranked=rows.map((p,i)=>{if(p.solved.length!==last){rank=i+1;last=p.solved.length;}return {...p,rank};});
   return res.status(200).json({board:process.env.CTF_BOARD_ID||'moss-class',players:ranked,updatedAt:new Date().toISOString()});
  }
  if(req.method!=='POST'){res.setHeader('Allow','GET, POST');return res.status(405).json({error:'Use GET or POST.'});}
  // Browser mutations must be same-origin. Missing Origin is permitted for API tests/non-browser clients.
  if(req.headers.origin){let origin;try{origin=new URL(req.headers.origin).host;}catch{throw safeError(403,'Use the CTF page to join and submit.');}if(origin!==req.headers.host)throw safeError(403,'Use the CTF page to join and submit.');}
  let body=req.body;
  if(typeof body==='string'){if(Buffer.byteLength(body)>2000)throw safeError(413,'That request is too large.');try{body=JSON.parse(body);}catch{throw safeError(400,'Use a valid request.');}}
  if(!body||typeof body!=='object'||Array.isArray(body))throw safeError(400,'Use a valid request.');
  const action=body.action;
  if(action==='join'){
   await rateLimit(req,prefix,'join');
   const initials=typeof body.initials==='string'?body.initials.trim().toUpperCase():'';
   if(!/^[A-Z]{1,4}$/.test(initials))throw safeError(400,'Enter 1–4 letters for your initials.');
   const id=crypto.randomBytes(5).toString('hex'),token=crypto.randomBytes(32).toString('base64url');
   const player={id,initials,solved:[]};
   const ok=await redis(['EVAL',JOIN_SCRIPT,'2',sessionKey(prefix,token),players,id,JSON.stringify(player),String(TTL)]);
   if(!ok)throw safeError(409,'This board is full. Ask Moss to start a fresh board.');
   return res.status(201).json({token,player,board:process.env.CTF_BOARD_ID||'moss-class'});
  }
  if(action!=='me'&&action!=='solve')throw safeError(400,'Unknown board action.');
  await rateLimit(req,prefix,'write');const id=await authenticate(req,prefix);
  if(action==='me'){
   const raw=await redis(['HGET',players,id]);if(!raw)throw safeError(401,'This board has been reset. Start a new shift.');
   return res.status(200).json({player:playerView(raw),board:process.env.CTF_BOARD_ID||'moss-class'});
  }
  const mission=body.mission,answer=typeof body.answer==='string'?body.answer.trim().toUpperCase():'';
  if(typeof mission!=='string'||!Object.hasOwn(ANSWERS,mission)||answer.length>200)throw safeError(400,'Choose a valid mission and complete flag.');
  if(answer!==ANSWERS[mission])return res.status(200).json({correct:false});
  // Atomic unique insertion: retries/concurrent submissions never award a flag twice.
  const raw=await redis(['EVAL',SOLVE_SCRIPT,'1',players,id,mission,String(TTL)]);
  if(!raw)throw safeError(401,'This board has been reset. Start a new shift.');
  return res.status(200).json({correct:true,player:playerView(raw)});
 }catch(e){return res.status(e.status||503).json({error:e.status?e.message:'The leaderboard is temporarily unavailable. You can keep practicing.'});}
};
