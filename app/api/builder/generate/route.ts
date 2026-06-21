/**
 * Builder block-generation endpoint (BSO-658).
 *
 * Replaces the prototype's window.claude.complete with a real Anthropic call.
 * The builder's askClaude() already JSON-parses the returned text and falls back
 * to a default block on any error — so when ANTHROPIC_API_KEY is absent (e.g. a
 * preview without the secret), we return empty text and the UI degrades cleanly.
 */
export const runtime = 'nodejs';

export async function POST(req: Request) {
  let prompt = '';
  try {
    const body = await req.json();
    prompt = typeof body?.prompt === 'string' ? body.prompt : '';
  } catch {
    return Response.json({ text: '' });
  }
  if (!prompt) return Response.json({ text: '' });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ text: '' }); // graceful fallback in the UI

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const j = await r.json();
    const text =
      Array.isArray(j?.content) && j.content[0]?.type === 'text'
        ? j.content[0].text
        : '';
    return Response.json({ text });
  } catch {
    return Response.json({ text: '' });
  }
}
