'use strict';
const $ = s => document.querySelector(s);
const escapeHTML = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LEVELS = {
 beginner:{name:'Beginner',label:'01 / FIRST SHIFT',tag:'GUIDED · ~30 MIN',desc:'Learn the moves. Decode a message, inspect a webpage, and reveal a hidden signal.'},
 intermediate:{name:'Intermediate',label:'02 / DEEPER SIGNAL',tag:'SUPPORTED · ~35–45 MIN',desc:'Connect the clues. Read pixel bits, follow DNS, and investigate network evidence.'},
 advanced:{name:'Advanced',label:'03 / NIGHT SHIFT',tag:'INDEPENDENT · ~45–60 MIN',desc:'Build the case. Unwrap layered clues, audit settings, and reconstruct the timeline.'}
};
const STORAGE='ghost-runner-v1';
let state={level:'beginner',current:'b1',solved:{},notes:{},hints:{},alias:'',reflections:{}}, storageOK=true;
try {
 const saved=JSON.parse(localStorage.getItem(STORAGE)||'null');
 if(saved && typeof saved==='object') {
  for(const key of ['solved','notes','hints']) if(saved[key] && typeof saved[key]==='object' && !Array.isArray(saved[key])) {
   for(const m of MISSIONS){const value=saved[key][m.id];if(key==='solved'&&value===true)state[key][m.id]=true;if(key==='notes'&&typeof value==='string')state[key][m.id]=value.slice(0,3000);if(key==='hints'&&Number.isInteger(value)&&value>=0&&value<=3)state[key][m.id]=value;}
  }
  if(saved.reflections && typeof saved.reflections==='object')for(const key of ['Weakness','Fix','Permission'])if(typeof saved.reflections[key]==='string')state.reflections[key]=saved.reflections[key].slice(0,1000);
  if(typeof saved.alias==='string') state.alias=saved.alias.slice(0,50);
  if(LEVELS[saved.level]) state.level=saved.level;
  if(MISSIONS.some(m=>m.id===saved.current && m.level===state.level)) state.current=saved.current;
  else state.current=MISSIONS.find(m=>m.level===state.level).id;
 }
 localStorage.setItem(STORAGE,JSON.stringify(state));
} catch(e){storageOK=false;}
const list=()=>MISSIONS.filter(m=>m.level===state.level);
const current=()=>MISSIONS.find(m=>m.id===state.current);
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch(e){storageOK=false;$('#storageWarning').hidden=false;}}
function toast(s){$('#toast').textContent=s;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').textContent='',4500);}
function goWorkspace(){ $('#workspace').scrollIntoView({behavior:'smooth',block:'start'});$('#workspace').focus({preventScroll:true}); }
function changeLevel(level){state.level=level;state.current=MISSIONS.find(m=>m.level===level && !state.solved[m.id])?.id||MISSIONS.find(m=>m.level===level).id;save();render();goWorkspace();}
function renderLevels(){
 $('#levels').innerHTML=Object.entries(LEVELS).map(([key,l])=>`<button class="level-card ${key===state.level?'selected':''}" data-level="${key}" aria-pressed="${key===state.level}"><span class="level-num">${l.label}</span><span class="arrow" aria-hidden="true">↗</span><h3>${l.name}</h3><p>${l.desc}</p><small>${l.tag} · ${MISSIONS.filter(m=>m.level===key&&state.solved[m.id]).length}/5 SOLVED</small></button>`).join('');
 document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>changeLevel(b.dataset.level));
}
function renderRoute(){
 const l=LEVELS[state.level],ms=list(),done=ms.filter(m=>state.solved[m.id]).length;
 $('#levelName').textContent=l.name;$('#levelInfo').textContent=l.tag;
 $('#route').innerHTML=ms.map((m,i)=>`<button class="route-step ${m.id===state.current?'active':''}" data-mission="${m.id}" ${m.id===state.current?'aria-current="step"':''}><span class="num">${state.solved[m.id]?'✓':String(i+1).padStart(2,'0')}</span><span class="name">${m.title}<small>${m.kind.toUpperCase()} · ${m.minutes} MIN</small></span></button>`).join('');
 document.querySelectorAll('[data-mission]').forEach(b=>b.onclick=()=>{state.current=b.dataset.mission;save();render();goWorkspace();});
 $('#progressLabel').textContent=`${done} / 5 FLAGS RECOVERED`;$('#progress').value=done;$('#progress').setAttribute('aria-label',`${done} of 5 missions solved`);
}
function renderMission(){
 const m=current(),done=!!state.solved[m.id],h=Math.min(Number(state.hints[m.id])||0,3),idx=list().findIndex(x=>x.id===m.id);
 $('#mission').innerHTML=`<div class="mission-meta"><span>${m.id.toUpperCase()} / ${m.kind.toUpperCase()}</span><span>~${m.minutes} MIN · ${done?'RECOVERED ✓':'INVESTIGATE'}</span></div><h2>${m.title}</h2><p class="brief">${escapeHTML(m.brief)}</p><ol class="steps">${m.steps.map(s=>`<li><span>${escapeHTML(s)}</span></li>`).join('')}</ol>
 ${m.evidence?`<div class="evidence-title">CASE EVIDENCE / READ CAREFULLY</div><pre class="evidence" tabindex="0" aria-label="Case evidence">${escapeHTML(m.evidence)}</pre><button class="quiet" id="copyEvidence">Copy evidence</button>`:''}
 ${m.asset?`<a class="asset-link" href="evidence/${m.asset}" target="_blank" rel="noopener">Open supplied ${m.asset.endsWith('.png')?'image':'webpage'} evidence ↗</a>${m.asset.endsWith('.png')?`<img class="evidence-image" src="evidence/${m.asset}" alt="${m.id==='b5'?'Canal Gate poster with a faint hidden message':'Signal badge containing hidden pixel data'}">`:''}`:''}
 ${m.id==='b3'?'<details class="source-view"><summary>View supplied HTML (start here)</summary><pre id="sourceCode" class="evidence">Loading supplied source…</pre></details>':''}
 ${m.tool?`<button class="quiet" id="suggestTool">Open ${toolName(m.tool)} in Field Kit ↗</button>`:''}
 <form id="flagForm"><label for="flagInput">Recovered flag · include HACK{...}</label><div class="flag-row"><input id="flagInput" autocomplete="off" spellcheck="false" maxlength="200" placeholder="HACK{YOUR_ANSWER}" aria-describedby="flagFeedback" ${done?'value="'+escapeHTML(m.answer)+'"':''}><button type="submit" class="primary">Check flag →</button></div><div id="flagFeedback" class="feedback ${done?'success':''}" role="status">${done?'Flag recovered. Now explain your evidence below.':''}</div></form>
 <button class="hint-button" id="hintButton" ${h>=3?'disabled':''}>${h>=3?'All 3 hints shown':h?`Next hint (${h}/3 used)`:'Need a nudge? Hint 1 of 3'}</button><div id="hints">${m.hints.slice(0,h).map((x,i)=>`<p class="hint-content"><strong>Hint ${i+1}:</strong> ${escapeHTML(x)}</p>`).join('')}</div>
 ${done?`<div class="debrief"><h3>CASE DEBRIEF / WHY IT MATTERS</h3><p>${escapeHTML(m.explain)}</p></div>`:''}
 <label for="evidenceNote">Your evidence note ${state.notes[m.id]?.trim()?'✓':''}</label><textarea id="evidenceNote" maxlength="3000" placeholder="I observed ___. I used ___ to ___. This supports ___ because ___.">${escapeHTML(state.notes[m.id]||'')}</textarea><p class="note-tip">One or two sentences. A flag is an answer; your reasoning makes it evidence. Notes save as you type.</p>
 <button id="nextButton" class="${done?'primary':'quiet'} next-button">${idx<4?'Next mission →':'Review this level’s handoff →'}</button>
 ${list().every(x=>state.solved[x.id])?'<div class="level-complete"><strong>Route restored.</strong> You recovered all five flags. Finish your evidence notes, then download your handoff below.</div>':''}`;
 $('#flagForm').onsubmit=ev=>{ev.preventDefault();checkFlag($('#flagInput').value);};
 $('#hintButton').onclick=()=>{state.hints[m.id]=h+1;save();renderMission();};
 $('#evidenceNote').oninput=ev=>{state.notes[m.id]=ev.target.value;save();renderHandoff();};
 $('#nextButton').onclick=()=>{if(idx<4){state.current=list()[idx+1].id;save();render();goWorkspace();}else{$('.handoff').scrollIntoView({behavior:'smooth'});$('#exportButton').focus({preventScroll:true});}};
 if($('#copyEvidence'))$('#copyEvidence').onclick=()=>copyText(m.evidence);
 if($('#suggestTool'))$('#suggestTool').onclick=()=>{$('#toolSelect').value=m.tool;renderTool();$('.kit').scrollIntoView({behavior:'smooth',block:'start'});$('#toolSelect').focus({preventScroll:true});};
 if(m.id==='b3'){
  const missionId=m.id;
  fetch('evidence/maintenance.html').then(r=>{if(!r.ok)throw Error('source');return r.text();}).then(t=>{if(current().id===missionId&&$('#sourceCode'))$('#sourceCode').textContent=t;}).catch(()=>{if($('#sourceCode'))$('#sourceCode').textContent='Could not load the source. Open this app through its hosted URL, then retry. The supplied webpage is evidence/maintenance.html.';});
 }
}
function normalizeFlag(s){return String(s).trim().toUpperCase();}
function checkFlag(raw){const m=current(),f=$('#flagFeedback');if(normalizeFlag(raw)===normalizeFlag(m.answer)){
 state.solved[m.id]=true;save();render();globalThis.GhostBoard?.record(m.id);$('#evidenceNote').focus({preventScroll:true});toast('Flag recovered. Explain what the evidence tells you.');
 }else{f.className='feedback error';f.textContent=raw.trim()?'Not yet. Check the braces, underscores, and evidence. Use a hint if you’re stuck.':'Enter the complete flag first. Example: HACK{FOUND_IT}';}}
function renderHandoff(){const ms=list(),done=ms.filter(m=>state.solved[m.id]).length,notes=ms.filter(m=>typeof state.notes[m.id]==='string'&&state.notes[m.id].trim()).length;const ready=done===5&&notes===5;
 $('.handoff').classList.toggle('ready',ready);$('#handoffStatus').textContent=`${LEVELS[state.level].name}: ${done}/5 flags recovered · ${notes}/5 evidence notes. ${ready?'Ready to submit to Moss.':'You can download a draft at any time. Complete the flags and notes for a finished handoff.'}`;
 $('#exportButton').textContent=ready?'Handoff ready · Download (.txt) ↗':'Download draft handoff (.txt) ↗';
}
function render(){renderLevels();renderRoute();renderMission();renderHandoff();}
function toolName(t){return {caesar:'Caesar cipher',base64:'Base64 decoder',hex:'Hex decoder',reveal:'Image Reveal',pixels:'Pixel Reader',hash:'SHA-256'}[t];}
function caesar(text,n,decode=true){const shift=(decode?-n:n);return text.replace(/[a-z]/gi,c=>{const a=c===c.toUpperCase()?65:97;return String.fromCharCode(((c.charCodeAt(0)-a+shift)%26+26)%26+a);});}
function decodeBase64(s){const clean=s.replace(/\s/g,'');if(!clean||!/^[A-Za-z0-9+/]*={0,2}$/.test(clean)||clean.length%4===1)throw Error('Paste a valid Base64 payload.');return new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(atob(clean),c=>c.charCodeAt(0)));}
function decodeHex(s){const clean=s.replace(/\s/g,'');if(!clean||clean.length%2||!/^[a-f0-9]+$/i.test(clean))throw Error('Use pairs of hex digits (0–9 and A–F), separated by spaces if you like.');return new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(clean.match(/../g),x=>parseInt(x,16)));}
function output(s){$('#toolOutput').textContent=s;}
function renderTool(){const type=$('#toolSelect').value;
 const descriptions={caesar:'Move each letter backward (decode) or forward (encode). Braces, digits, and punctuation stay unchanged.',base64:'Reverse a printable text encoding. No secret key is needed; this is not encryption.',hex:'Each pair of hex digits represents one byte. For these clues, those bytes form readable text.',reveal:'Increase the contrast of the poster’s dark pixels. This reveals faint text, not hidden pixel bits.',pixels:'Read red-channel LSBs from top-left, left-to-right, row-by-row. Eight bits make one byte; stop at a zero byte.',hash:'Generate a SHA-256 fingerprint of the exact UTF-8 text. Spaces, capitalization, and punctuation change the hash.'};
 let body=`<p class="tool-description">${descriptions[type]}</p>`;
 if(type==='reveal')body+='<canvas id="revealCanvas" class="evidence-image" role="img" aria-label="Canal poster under contrast analysis"></canvas><label for="contrast">Reveal strength: <span id="contrastValue">0</span>%</label><input type="range" id="contrast" min="0" max="100" value="0"><p class="tool-description">Move right to make the faint message visible.</p>';
 else if(type==='pixels')body+='<button id="readSignal">Read signal badge (I4)</button><button id="readFinal">Read final badge (A5)</button>';
 else{
 body+='<label for="toolInput">'+(type==='hash'?'Exact candidate text (no label)':'Paste the evidence text')+'</label><textarea id="toolInput" spellcheck="false" placeholder="Paste here…"></textarea>';
 if(type==='caesar')body+='<div class="tool-controls"><label for="shift">Shift<input type="number" min="0" max="25" id="shift" value="3"></label><label for="direction">Direction<select id="direction"><option value="decode">Decode ←</option><option value="encode">Encode →</option></select></label></div>';
 body+='<button id="runTool" class="primary">'+(type==='hash'?'Compute SHA-256':'Decode / transform')+' →</button>';
 }
 body+='<div id="toolOutput" class="tool-output" role="status" aria-live="polite"></div>';
 if(type!=='reveal')body+='<button id="copyOutput" class="quiet">Copy tool result</button>';
 $('#toolBody').innerHTML=body;
 if(type==='reveal'){
  const img=new Image();let original;
  const redraw=()=>{if($('#toolSelect').value!=='reveal'||!original)return;const v=Number($('#contrast').value);$('#contrastValue').textContent=v;const c=$('#revealCanvas'),ctx=c.getContext('2d');const frame=new ImageData(new Uint8ClampedArray(original.data),original.width,original.height);for(let i=0;i<frame.data.length;i+=4)for(let ch=0;ch<3;ch++)frame.data[i+ch]=14+(frame.data[i+ch]-14)*(1+v*.5);ctx.putImageData(frame,0,0);};
  img.onload=()=>{if($('#toolSelect').value!=='reveal')return;const c=$('#revealCanvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);original=ctx.getImageData(0,0,c.width,c.height);redraw();};
  img.onerror=()=>{if($('#toolSelect').value==='reveal')output('Poster could not load. Check that the evidence folder was deployed.');};img.src='evidence/poster.png';$('#contrast').oninput=redraw;
 }
 else if(type==='pixels'){$('#readSignal').onclick=()=>readPixels('signal.png');$('#readFinal').onclick=()=>readPixels('final.png');}
 else $('#runTool').onclick=async()=>{try{const value=$('#toolInput').value;if(!value)throw Error('Paste the evidence text first.');let result;
  if(type==='caesar'){const shift=Number($('#shift').value);if(!Number.isInteger(shift)||shift<0||shift>25)throw Error('Choose a whole-number shift from 0 to 25.');result=caesar(value,shift,$('#direction').value==='decode');}
  if(type==='base64')result=decodeBase64(value);
  if(type==='hex')result=decodeHex(value);
  if(type==='hash'){if(!globalThis.crypto?.subtle)throw Error('SHA-256 needs a secure hosted page (HTTPS) or localhost. Open the hosted app.');result=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),b=>b.toString(16).padStart(2,'0')).join('');}
  // Tool may have changed while an asynchronous digest was running.
  if($('#toolSelect').value===type)output(result);
 }catch(e){if($('#toolSelect').value===type)output('Check your input: '+e.message);}};
 if($('#copyOutput'))$('#copyOutput').onclick=()=>{if($('#toolOutput').textContent)copyText($('#toolOutput').textContent);else toast('Run the tool first.');};
}
function readPixels(name){output('Reading pixel bits…');const img=new Image();img.onload=()=>{if($('#toolSelect').value!=='pixels')return;try{
 const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);const data=ctx.getImageData(0,0,img.width,img.height).data;const bytes=[];let byte=0,count=0,terminated=false;
 for(let i=0;i<data.length;i+=4){byte=(byte<<1)|(data[i]&1);count++;if(count===8){if(byte===0){terminated=true;break;}bytes.push(byte);byte=0;count=0;}}
 if(!terminated)throw Error('No message terminator found.');output(new TextDecoder().decode(Uint8Array.from(bytes)));
 }catch(e){output('Could not read this evidence: '+e.message);}};img.onerror=()=>{if($('#toolSelect').value==='pixels')output('Image could not load. Check that the evidence folder was deployed with the app.');};img.src='evidence/'+name;}
async function copyText(s){try{if(!navigator.clipboard)throw Error('clipboard');await navigator.clipboard.writeText(s);toast('Copied. Paste into your next tool or answer box.');}catch(e){toast('Clipboard unavailable. Select the text and use Ctrl+C (Windows) or Command+C (Mac).');}}
function buildReport(){return ['GHOST RUNNER // CHATTY HACKVILLE','CALL SIGN: '+(state.alias||'Not supplied'),'BOARD RUNNER: '+(globalThis.GhostBoard?.identity()||'Practice only'),'EXPORTED: '+new Date().toISOString(),'Current route: '+LEVELS[state.level].name,'','This record downloads to the student device; submit it to Moss as directed.','',...MISSIONS.map(m=>`${m.id.toUpperCase()} / ${m.title}\nStatus: ${state.solved[m.id]?'FLAG RECOVERED':'NOT YET SOLVED'}\nRecovered flag: ${state.solved[m.id]?m.answer:'—'}\nHints used: ${Number(state.hints[m.id])||0}/3\nEvidence note: ${state.notes[m.id]||'Not yet recorded'}\n`),'OPTIONAL REAL-LIFE REFLECTION:', 'Weakness I can recognize: '+(state.reflections.Weakness||'Not recorded'), 'A possible fix: '+(state.reflections.Fix||'Not recorded'), 'Permission needed: '+(state.reflections.Permission||'Not recorded')].join('\n');}
$('#exportButton').onclick=()=>{const text=buildReport();const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Ghost_Runner_Handoff.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);toast('Downloaded. Submit the file where Moss directs.');};
for(const key of ['Weakness','Fix','Permission']){$('#reflection'+key).value=state.reflections[key]||'';$('#reflection'+key).oninput=ev=>{state.reflections[key]=ev.target.value;save();};}
$('#alias').value=state.alias;$('#alias').oninput=ev=>{state.alias=ev.target.value;save();};
$('#resetButton').onclick=()=>{if(!confirm('Reset all flags, hints, notes, and your call sign in this browser? Download your handoff first.'))return;state={level:'beginner',current:'b1',solved:{},notes:{},hints:{},alias:'',reflections:{}};save();$('#alias').value='';for(const key of ['Weakness','Fix','Permission'])$('#reflection'+key).value='';render();toast('Progress reset. A new shift is ready.');};
$('#toolSelect').onchange=renderTool;
function showWelcome(){ $('#welcome').hidden=false;$('#welcome').scrollIntoView({behavior:'smooth',block:'start'});$('#beginButton').focus({preventScroll:true}); }
$('#startButton').onclick=showWelcome;$('#helpButton').onclick=showWelcome;
$('#beginButton').onclick=()=>changeLevel('beginner');
$('#storageWarning').hidden=storageOK;
render();renderTool();
