// aiService.ts


export interface AISuggestion {
  category: string;
  description: string;
  confidence: number;
  reasoning: string;
}

const VALID_CATEGORIES = [
  'Vandalism',
  'Litter',
  'Graffiti',
  'Infrastructure Issue',
  'Overgrowth',
  'Other',
];

// Change this depending on environment
// Local dev: http://localhost:11434
// Ngrok tunnel: https://<your-tunnel>.ngrok-free.dev
const OLLAMA_API = '/api/ai';
const MODEL = 'phi3.5';

export async function getAISuggestions(userDescription: string): Promise<AISuggestion | null> {
  try {
    const prompt = `You must respond with ONLY valid JSON, no other text.

City Issue Report: "${userDescription}"

Valid Categories: ${VALID_CATEGORIES.join(', ')}

Respond with this JSON structure:
{
  "category": "pick the best matching category from valid categories",
  "description": "provide a clearer, more professional 1-2 sentence summary",
  "confidence": a number between 0 and 1 indicating how confident you are,
  "reasoning": "brief explanation of why this category was chosen"
}`;

    const res = await fetch(OLLAMA_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, prompt, temperature: 0.3 }),
    });

    if (!res.ok) {
      console.error('Ollama API error:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    let suggestion: AISuggestion;

    try {
      // Parse JSON returned by Ollama
      suggestion = JSON.parse(data.response);
    } catch {
      // Fallback keyword-based categorization
      const desc = userDescription.toLowerCase();
      let category = 'Other';
      if (desc.includes('trash') || desc.includes('litter')) category = 'Litter';
      else if (desc.includes('graffiti') || desc.includes('spray')) category = 'Graffiti';
      else if (desc.includes('broken') || desc.includes('pothole')) category = 'Infrastructure Issue';
      else if (desc.includes('overgrown') || desc.includes('weeds')) category = 'Overgrowth';
      else if (desc.includes('vandal') || desc.includes('broken glass')) category = 'Vandalism';

      suggestion = {
        category,
        description: userDescription,
        confidence: 0.6,
        reasoning: 'Fallback keyword-based categorization',
      };
    }

    // Normalize category
    const validCategory =
      VALID_CATEGORIES.find((c) => c.toLowerCase() === suggestion.category.toLowerCase()) || 'Other';

    return {
      category: validCategory,
      description: suggestion.description || userDescription,
      confidence: Math.min(1, Math.max(0, suggestion.confidence || 0.5)),
      reasoning: suggestion.reasoning || 'Based on description provided',
    };
  } catch (err) {
    console.error('AI Service Error:', err);
    return null;
  }
}
