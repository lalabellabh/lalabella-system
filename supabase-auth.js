/* Lalabella Supabase Auth adapter. No legacy Apps Script auth. */
(function(){
  'use strict';
  async function client(){
    if(!window.LalabellaSupabase) throw new Error('Supabase client adapter is unavailable');
    return window.LalabellaSupabase.ready();
  }
  const api={
    async signIn(email,password){const supabase=await client();return supabase.auth.signInWithPassword({email,password});},
    async signOut(){const supabase=await client();return supabase.auth.signOut();},
    async getUser(){const supabase=await client();const {data,error}=await supabase.auth.getUser();return error?null:data.user;},
    async getSession(){const supabase=await client();return supabase.auth.getSession();},
    async getProfile(){const supabase=await client();const {data:{user},error:userError}=await supabase.auth.getUser();if(userError||!user)return null;const {data,error}=await supabase.from('profiles').select('id,username,full_name,role,branch,photo_link,created_at,updated_at').eq('id',user.id).maybeSingle();if(error)throw error;return data;},
    async onAuthStateChange(callback){const supabase=await client();return supabase.auth.onAuthStateChange(callback);}
  };
  window.LalabellaAuth=Object.freeze(api);
  window.sbAuth=window.LalabellaAuth;

  // Shared navigation: every authenticated module gets a consistent,
  // unobtrusive Home button. Login and the home page are excluded.
  function addHomeButton(){
    const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    if(path==='login.html'||path===''||path==='index.html') return;
    if(document.getElementById('lalabellaHomeButton')) return;
    const style=document.createElement('style');
    style.textContent='#lalabellaHomeButton{position:fixed;top:14px;left:14px;z-index:99990;display:inline-flex;align-items:center;gap:7px;padding:9px 13px;border:1px solid rgba(230,196,122,.45);border-radius:22px;background:rgba(18,8,11,.88);backdrop-filter:blur(10px);color:#f7eee5;text-decoration:none;font:700 11px Inter,Arial,sans-serif;box-shadow:0 8px 22px rgba(0,0,0,.18);transition:.2s}#lalabellaHomeButton:hover{transform:translateY(-2px);border-color:#e6c47a;color:#e6c47a}@media(max-width:600px){#lalabellaHomeButton{top:10px;left:10px;padding:8px 10px;font-size:10px}}';
    document.head.appendChild(style);
    const a=document.createElement('a');a.id='lalabellaHomeButton';a.href='index.html';a.setAttribute('aria-label','Back to Home');a.innerHTML='⌂&nbsp; Back to Home';
    document.body.appendChild(a);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addHomeButton,{once:true}); else addHomeButton();
})();