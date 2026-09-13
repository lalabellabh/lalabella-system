/* Lalabella Supabase session guard. No legacy Apps Script auth. */
(function(){
  'use strict';
  const here=location.pathname.split('/').pop()||'index.html';
  const publicPages=new Set(['login.html']);
  const login='login.html';
  document.documentElement.style.visibility='hidden';
  function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=()=>reject(new Error('Failed to load '+src));document.head.appendChild(s);});}
  async function boot(){
    try{
      if(!window.LALABELLA_SUPABASE) await load('supabase-config.js');
      if(!window.LalabellaSupabase) await load('supabase-client.js');
      if(!window.LalabellaAuth) await load('supabase-auth.js');
      const user=await window.LalabellaAuth.getUser();
      if(!user && !publicPages.has(here)){location.replace(login);return;}
      if(user){
        const profile=await window.LalabellaAuth.getProfile();
        if(!profile && !publicPages.has(here)){location.replace(login);return;}
        window.LALABELLA_USER=user;
        window.LALABELLA_PROFILE=profile||null;
      }
      document.documentElement.style.visibility='';
    }catch(e){
      console.error('[Lalabella] auth guard failed',e);
      if(!publicPages.has(here)) location.replace(login); else document.documentElement.style.visibility='';
    }
  }
  boot();
})();
function lalabellaCheckResponse(data){
  if(data&&typeof data==='object'&&!Array.isArray(data)&&'error' in data)throw new Error(data.error||'Unknown server error');
  return data;
}
(function(){try{const pending=sessionStorage.getItem('joyboyPendingSpeech');if(pending){sessionStorage.removeItem('joyboyPendingSpeech');window.addEventListener('load',()=>{try{speechSynthesis.speak(new SpeechSynthesisUtterance(pending));}catch(e){}});}}catch(e){}})();