'use strict';
const $ = (id)=>document.getElementById(id);
const PAGE = document.body.dataset.page;
const REGIONS = ['WASHINGTON','OREGON','CALIFORNIA','NEVADA','NEW YORK'];
const SERVER_NAMES = ['Sentinel-07','Obsidian-12','Vanguard-03','Phantom-09','Ironclad-05','Cipher-14','Spectre-02','Aegis-08','Blackout-11','Titan-06'];
const shuffle = a => { const out=[...a]; for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [out[i],out[j]]=[out[j],out[i]];}return out; };
if(PAGE==='login'){
 $('region').addEventListener('change',()=>{
   const s=$('server');s.replaceChildren();
   if(!$('region').value){s.add(new Option('Select region first',''));s.disabled=true;return;}
   s.disabled=false;s.add(new Option('Choose server identification',''));
   for(const name of shuffle(SERVER_NAMES)) s.add(new Option(`${$('region').value.slice(0,2)}-${name}`,name));
 });
 $('loginForm').addEventListener('submit',e=>e.preventDefault());
}
if(PAGE==='dashboard'){
 const aliases={
   systems:[['BC-SYS-001','Corporate Portal','Corporate entry and navigation'],['BC-SYS-002','NEXUS Management','Management application'],['BC-SYS-003','MansArmedForces Collections','Uniform and inmate collection portal'],['BC-SYS-004','Gunner Thompson AI','Character AI website'],['BC-SYS-005','GitHub Pages','Website hosting'],['BC-SYS-006','Supabase Services','Authentication and database infrastructure']],
   servers:[['BC-SRV-001','Dolphin 3.0 / RunPod','AI inference endpoint'],['BC-SRV-002','Qwen3 32B','Planned conversational model'],['BC-SRV-003','Qwen3.5 9B Vision','Planned vision model'],['BC-SRV-004','Memory Retrieval Service','Planned background and conversation memory']]
 };
 let opened=null;
 const modal=(title,eyebrow,content)=>{
   $('modalTitle').textContent=title;$('modalEyebrow').textContent=eyebrow;$('modalContent').replaceChildren();
   if(typeof content==='string') $('modalContent').innerHTML=content;
   else $('modalContent').append(content);
   $('modalBackdrop').hidden=false;document.body.style.overflow='hidden';$('closeModal').focus();
 };
 const closeModal=()=>{$('modalBackdrop').hidden=true;document.body.style.overflow='';opened=null;};
 $('closeModal').onclick=closeModal;
 $('modalBackdrop').addEventListener('click',e=>{if(e.target===$('modalBackdrop'))closeModal();});
 const closeDrawer=()=>{$('drawer').classList.remove('open');$('drawer').setAttribute('aria-hidden','true');$('menuButton').setAttribute('aria-expanded','false');$('shade').hidden=true;};
 $('menuButton').onclick=()=>{$('drawer').classList.add('open');$('drawer').setAttribute('aria-hidden','false');$('menuButton').setAttribute('aria-expanded','true');$('shade').hidden=false;};
 $('closeDrawer').onclick=closeDrawer;$('shade').onclick=closeDrawer;
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeDrawer();}});
 const para=(s)=>{const p=document.createElement('p');p.className='dim small';p.textContent=s;return p;};
 const lockModal=(name,kind)=>{
   const el=document.createElement('div');el.className='modal-content';
   el.append(para(`A separate ${kind} password will be required for ${name}. Verification must happen on a secure server; the design preview cannot verify or reveal restricted data.`));
   const label=document.createElement('label');label.textContent=`${kind} Password`;label.htmlFor='restrictedPass';
   const input=document.createElement('input');input.type='password';input.id='restrictedPass';input.placeholder='Not enabled in preview';input.disabled=true;
   const disabled=document.createElement('button');disabled.className='btn primary full';disabled.textContent='Verify & Unlock';disabled.disabled=true;
   const note=document.createElement('div');note.className='locked';note.textContent='Locked: live activity, private details, and authenticated access are not available in this preview. The layout below is illustrative only.';
   el.append(label,input,disabled,note);
   return el;
 };
 const tile=(name,description)=>`<div class="modal-tile"><b>${name}</b><small>${description}</small></div>`;
 const layout=(type)=>{
   const title=type==='nexus'?'NEXUS Management':'MansArmedForces';
   const el=lockModal(title,'Division');
   const heading=document.createElement('h3');heading.textContent='Overview layout preview';heading.style.margin='16px 0 0';el.append(heading);
   const content=document.createElement('div');content.className='modal-grid';
   content.innerHTML=type==='nexus'?[
     tile('Recent Activity','Record changes, registrations, and administrative events'),
     tile('System Updates','Deployments, releases, and pending improvements'),
     tile('Notifications','Outstanding requests and system alerts'),
     tile('System Health','Authenticated backend and synchronization checks')
   ].join(''):[
     tile('Collection Activity','Recent uploads, favorites, and ratings'),
     tile('Division Updates','New galleries and feature releases'),
     tile('AI Operations','Dolphin, future Qwen services, and inference health'),
     tile('Reviews & Alerts','Photo analysis, pending reviews, and notices')
   ].join('');el.append(content);
   const actions=document.createElement('div');actions.className='modal-actions';
   const btn=document.createElement('button');btn.className='btn primary';btn.textContent=type==='nexus'?'Enter NEXUS Inmate Management →':'Enter MansArmedForces →';btn.disabled=true;
   actions.append(btn);el.append(actions,para('The launch button will activate after real authorization and destination configuration. The existing sites are not modified.'));
   modal(title,'BLACKCELL CORPORATION / RESTRICTED DIVISION',el);
 };
 document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>layout(b.dataset.open==='nexusAuth'?'nexus':'mans'));
 const list=(target,items)=>{
   items.forEach(([code,name,purpose])=>{
     const b=document.createElement('button');b.className='service-row';
     const dot=document.createElement('i');dot.className='indicator gray';
     const c=document.createElement('span');c.className='service-code';c.textContent=code;
     const status=document.createElement('span');status.className='service-caption';status.textContent='NOT CHECKED   🔒';
     b.append(dot,c,status);b.onclick=()=>{
       const el=lockModal(code,'Administrator');
       el.append(para('After successful server-side verification, this popup will reveal the service name, provider, purpose, health status, and last successful check.'));
       modal(code,'BLACKCELL CORPORATION / INFRASTRUCTURE DETAILS',el);
     };
     $(target).append(b);
   });
 };
 list('systemsList',aliases.systems);list('serversList',aliases.servers);
 const generic=(panel)=>{
   const names={account:'My Account',security:'Security Center',sessions:'Active Sessions',audit:'Security Activity',command:'Command Center'};
   if(panel==='command'){closeDrawer();return;}
   closeDrawer();
   const data={
     account:[['Account Profile','Authorized administrator identity and details'],['Corporate Credentials','Password, access code, and authorized server selection']],
     security:[['Corporate Credentials','Update credentials only after reauthentication'],['Division Security','NEXUS and MansArmedForces password controls'],['Session Policy','Automatic expiry, rate limits, and optional passkeys'],['Audit History','Privately recorded sign-in and security changes']],
     sessions:[['Current Session','The presently authenticated device, when implemented'],['Connected Devices','A list of verified signed-in devices'],['Revoke Session','Terminate a selected session across connected systems'],['Sign Out All Devices','Server-side revocation across all associated applications']],
     audit:[['Security Events','Verified sign-ins and rejected attempts'],['Device Alerts','New and unfamiliar device notifications'],['Credential Changes','Audit trail of secure updates'],['Revocations','Session and access grant termination history']]
   };
   const el=lockModal(names[panel],'Administrator');
   const grid=document.createElement('div');grid.className='modal-grid';grid.innerHTML=data[panel].map(x=>tile(x[0],x[1])).join('');el.append(grid);
   modal(names[panel],'BLACKCELL CORPORATION / CORPORATE SECURITY',el);
 };
 document.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>generic(b.dataset.panel));
 $('bellButton').onclick=()=>{const el=document.createElement('div');el.className='modal-content';el.append(para('Private corporate security notifications will appear here once authenticated event recording is connected. No live alerts are displayed in this preview.'));
   const grid=document.createElement('div');grid.className='modal-grid';grid.innerHTML=[tile('New Devices','Unfamiliar sign-ins requiring review'),tile('Sign-In Attempts','Repeated failures and lockouts'),tile('Credential Updates','Password and access-code events'),tile('Session Activity','Session termination and revocation')].join('');el.append(grid);modal('Security Notifications','BLACKCELL CORPORATION / PRIVATE ALERTS',el);
 };
 $('signOutButton').onclick=()=>{
   closeDrawer();const el=document.createElement('div');el.className='modal-content';el.append(para('In production, Secure Sign Out will revoke corporate access and coordinated sessions for NEXUS, MansArmedForces, and connected applications. This is not yet implemented.'));
   const warning=document.createElement('div');warning.className='locked';warning.textContent='Preview only: this action can return to the corporate login page, but it cannot revoke active Supabase or other site sessions.';el.append(warning);
   const row=document.createElement('div');row.className='modal-actions';const cancel=document.createElement('button');cancel.className='btn outline';cancel.textContent='Cancel';cancel.onclick=closeModal;
   const login=document.createElement('a');login.className='btn primary';login.href='index.html';login.textContent='Return to Login Preview';row.append(cancel,login);el.append(row);
   modal('Global Secure Sign Out','BLACKCELL CORPORATION / SESSION CONTROL',el);
 };
}
