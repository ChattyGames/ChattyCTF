'use strict';
// Initials are display names. Private random tokens keep separate runners separate.
(()=>{
 const SESSION_KEY='ghost-runner-board-v1';let session=null,connected=false,rows=[],busy=false,flushing=false;
 try{const s=JSON.parse(localStorage.getItem(SESSION_KEY)||'null');if(s&&/^[A-Za-z0-9_-]{43}$/.test(s.token||''))session=s;}catch{}
 function persist(){try{if(session)localStorage.setItem(SESSION_KEY,JSON.stringify(session));else localStorage.removeItem(SESSION_KEY);}catch{toast('This browser cannot remember your board sign-in. Copy your recovery code before leaving.');}}
 async function request(body,token=session?.token){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);try{
  const response=await fetch('/api/board',{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{}),cache:'no-store',signal:controller.signal});
  let data;try{data=await response.json();}catch{throw Error('The shared board is not connected here yet. You can keep practicing.');}
  if(!response.ok){const e=Error(data.error||'The board could not be reached. Try again.');e.status=response.status;throw e;}return data;
 }catch(e){if(e.name==='AbortError')throw Error('The board took too long to respond. Your local progress is saved.');throw e;}finally{clearTimeout(timer);}}
 function status(text){$('#boardStatus').textContent=text;}
 function controls(){
  $('#joinBoardForm').hidden=!!session||!connected;$('#restoreDetails').hidden=!!session||!connected;$('#runnerControls').hidden=!session;
  if(session)$('#runnerIdentity').textContent=session.initials+' · Runner '+session.id.slice(0,4).toUpperCase()+' (you)';
 }
 function clearPractice(){state={level:'beginner',current:'b1',solved:{},notes:{},hints:{},alias:'',reflections:{}};save();$('#alias').value='';for(const key of ['Weakness','Fix','Permission'])$('#reflection'+key).value='';render();}
 function applyPlayer(player){session={...session,...player};for(const id of player.solved)if(MISSIONS.some(m=>m.id===id))state.solved[id]=true;state.alias=player.initials;$('#alias').value=player.initials;save();persist();controls();render();}
 function table(){
  if(!rows.length){$('#boardTable').innerHTML='<p class="board-empty">No runners yet. Join with your initials to put the first signal on the board.</p>';return;}
  const groups=['beginner','intermediate','advanced'];
  $('#boardTable').innerHTML='<table><caption class="sr-only">Class leaderboard: rank, initials, solved missions by difficulty and total flags.</caption><thead><tr><th scope="col">Rank</th><th scope="col">Runner</th><th scope="col">Beginner</th><th scope="col">Intermediate</th><th scope="col">Advanced</th><th scope="col">Flags</th></tr></thead><tbody>'+rows.map(p=>`<tr class="${p.id===session?.id?'your-row':''}"><td>${p.rank}</td><th scope="row"><strong>${escapeHTML(p.initials)}</strong><small>#${escapeHTML(p.id.slice(0,4).toUpperCase())}${p.id===session?.id?' · YOU':''}</small></th>${groups.map(g=>'<td><div class="flag-chips">'+MISSIONS.filter(m=>m.level===g).map(m=>`<span class="flag-chip ${p.solved.includes(m.id)?'found':''}" title="${escapeHTML(m.title)}: ${p.solved.includes(m.id)?'solved':'not yet solved'}" aria-label="${m.id.toUpperCase()}: ${p.solved.includes(m.id)?'solved':'not yet solved'}">${m.id.toUpperCase()}${p.solved.includes(m.id)?' ✓':''}</span>`).join('')+'</div></td>').join('')}<td class="board-score">${p.solved.length}<small>/ 15</small></td></tr>`).join('')+'</tbody></table>';
 }
 async function refresh(){if(busy)return;busy=true;$('#refreshBoard').disabled=true;try{const data=await request();rows=data.players;connected=true;table();controls();$('#boardUpdated').textContent='Updated '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+' · refreshes every 45s';if(!session)status('Join with your initials. No school account or password needed.');}
 catch(e){connected=false;controls();$('#boardUpdated').textContent='Not connected';if(!rows.length)$('#boardTable').innerHTML='<p class="board-empty">The shared board is not available right now. Your practice missions still work below.</p>';status(e.message);}finally{busy=false;$('#refreshBoard').disabled=false;}}
 async function flush(){if(!session||flushing)return;flushing=true;const token=session.token;try{
  const pending=MISSIONS.filter(m=>state.solved[m.id]&&!session.solved?.includes(m.id));
  for(const m of pending){if(session?.token!==token)break;const data=await request({action:'solve',mission:m.id,answer:m.answer},token);if(session?.token!==token)break;if(data.correct){session.solved=data.player.solved;persist();}else throw Error('A flag could not be verified. Recheck the mission.');}
  if(session?.token===token){status('Signed in. '+session.solved.length+'/15 verified flags on the class board.');await refresh();}
 }catch(e){if(session?.token===token)status(e.message+' Unsent flags will retry automatically.');}finally{flushing=false;}}
 globalThis.GhostBoard={identity:()=>session?session.initials+' #'+session.id.slice(0,4).toUpperCase():'Practice only',record:()=>{if(session)void flush();}};
 $('#joinBoardForm').onsubmit=async ev=>{ev.preventDefault();const initials=$('#initials').value.trim().toUpperCase();if(!/^[A-Z]{1,4}$/.test(initials)){status('Use 1–4 letters for your initials.');return;}$('#joinBoardButton').disabled=true;try{const data=await request({action:'join',initials},null);session={token:data.token,...data.player,board:data.board};persist();applyPlayer(data.player);status('You joined. Adding recovered practice flags…');await flush();}catch(e){status(e.message);}finally{$('#joinBoardButton').disabled=false;}};
 $('#restoreBoardForm').onsubmit=async ev=>{ev.preventDefault();const token=$('#recoveryCode').value.trim();if(!/^[A-Za-z0-9_-]{43}$/.test(token)){status('Paste the complete private recovery code.');return;}
  if((Object.keys(state.notes).length||Object.keys(state.solved).length)&&!confirm('Restoring a different shift replaces practice flags and notes on this device. Download your handoff first. Continue?'))return;
  try{const data=await request({action:'me'},token);clearPractice();session={token,...data.player,board:data.board};applyPlayer(data.player);$('#recoveryCode').value='';status('Flags restored. Evidence notes remain on the device where you wrote them.');await refresh();}catch(e){status(e.message);}};
 $('#copyRecovery').onclick=()=>{if(session)void copyText(session.token);};
 $('#endShift').onclick=()=>{if(!confirm('End this shift on this device and clear its local notes? Download your handoff and copy your private recovery code first. Your shared flags remain on the board.'))return;session=null;persist();clearPractice();controls();table();status('Shift ended. The next runner can join with their own initials.');};
 const resetPractice=$('#resetButton').onclick;$('#resetButton').onclick=()=>{if(session){toast('Your board flags are saved online. Use “End shift on this device” before starting a new shift.');return;}resetPractice();};
 $('#refreshBoard').onclick=async()=>{if(session)await flush();else await refresh();};
 setInterval(()=>{if(document.visibilityState==='hidden')return;if(session)void flush();else void refresh();},45000);
 async function init(){await refresh();if(session){const token=session.token;try{const data=await request({action:'me'},token);if(session?.token!==token)return;applyPlayer(data.player);await flush();}catch(e){if(e.status===401){session=null;persist();controls();table();}status(e.message);}}}
 void init();
})();
