// Validates a Gemini API key directly against Google's API (client-side,
// BYOK — never touches our backend, so this scales to any number of
// users with zero extra server load). Uses a minimal generateContent
// call (1 output token) so it also genuinely tests whether the key can
// generate content — not just whether it exists — which is what
// actually matters before starting a live voice session.
//
// Returns { status: 'valid'|'invalid'|'quota_exceeded'|'network_error'|'empty', message }
export async function checkGeminiApiKey(key) {
  if (!key || !key.trim()) return { status: 'empty', message: '' };

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key.trim())}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hi' }] }],
          generationConfig: { maxOutputTokens: 1 }
        })
      }
    );

    if (res.ok) return { status: 'valid', message: 'Key valid hai ✅' };

    const data = await res.json().catch(() => ({}));
    const reason = (data && data.error && data.error.status) || '';

    if (res.status === 429) {
      return { status: 'quota_exceeded', message: 'Is key ka quota/limit khatam ho gaya hai ⚠️' };
    }
    if (res.status === 400 || res.status === 403 || reason === 'INVALID_ARGUMENT' || reason === 'PERMISSION_DENIED') {
      return { status: 'invalid', message: 'Ye API key invalid hai ❌' };
    }
    return { status: 'unknown', message: 'Key check nahi ho paya (status ' + res.status + ')' };
  } catch (e) {
    return { status: 'network_error', message: 'Internet check karo — key verify nahi ho payi' };
  }
}
