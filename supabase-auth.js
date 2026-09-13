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
})();