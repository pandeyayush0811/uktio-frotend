// Fill these in from:
// - Supabase Dashboard -> Project Settings -> API (URL + anon public key)
// - The backend URL wherever you deploy uktio-backend (Render/Railway/etc.)
// The anon key is safe to ship in the app — it only allows what your
// Supabase RLS policies permit, nothing more.
window.UKTIO_CONFIG = {
  SUPABASE_URL: 'https://pwdglktwuquoswqoyely.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3ZGdsa3R3dXF1b3N3cW95ZWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2MTYyODAsImV4cCI6MjEwMTE5MjI4MH0.GdwAJAXx8x98QvkvW1HAZh7F3PIZiV3Uqeoqm54ohRo',
  BACKEND_URL: 'https://uktio.onrender.com' // no trailing slash https://uktio.onrender.com/
};
