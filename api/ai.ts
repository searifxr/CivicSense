import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { prompt, model, temperature } = req.body;

    // LOCAL ONLY
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, temperature })
    });

    const text = await response.text();

    return res.status(200).json({ response: text });
  } catch (err) {
    console.error("Local Ollama error:", err);
    return res.status(500).json({ error: "Local Ollama not reachable" });
  }
}
