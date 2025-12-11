import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { userDescription } = req.body;

    const response = await fetch('https://nonvicariously-overage-lacy.ngrok-free.dev', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'phi3.5',
        prompt: `City Issue Report: "${userDescription}"`,
        temperature: 0.3,
      }),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text); // <-- safely parse JSON
    } catch (err) {
      console.error('Failed to parse Ollama response:', text);
      return res.status(500).json({ error: 'Invalid JSON from Ollama', raw: text });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('API Route Error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
