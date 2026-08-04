// Fill these in from:
// - Supabase Dashboard -> Project Settings -> API (URL + anon public key)
// - The backend URL wherever you deploy uktio-backend (Render/Railway/etc.)
// The anon key is safe to ship in the app — it only allows what your
// Supabase RLS policies permit, nothing more.

// Testing two backends side by side (main production service vs. this
// branch's separate service for the new /lite streaming feature)? Don't
// retype/comment-swap the URL every time — just flip this one word and
// reload (browser preview: instant; native app: `npx cap sync android`
// then rebuild, since www/ gets copied into the Android project).
const ACTIVE_BACKEND = 'lite'; // 'main' | 'lite'

const BACKENDS = {
  main: 'https://uktio.onrender.com',
  lite: 'https://uktio-backend.onrender.com'
};

window.UKTIO_CONFIG = {
  SUPABASE_URL: 'https://pwdglktwuquoswqoyely.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3ZGdsa3R3dXF1b3N3cW95ZWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2MTYyODAsImV4cCI6MjEwMTE5MjI4MH0.GdwAJAXx8x98QvkvW1HAZh7F3PIZiV3Uqeoqm54ohRo',
  BACKEND_URL: BACKENDS[ACTIVE_BACKEND] // no trailing slash
};
