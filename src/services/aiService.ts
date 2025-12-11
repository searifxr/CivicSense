//Ollama API endpoint
const OLLAMA_API = 'http://localhost:11434/api/generate';
const MODEL = 'phi3.5'; // Lightweight & fast - run: ollama pull orca-mini

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
    'Other'
];

//Main function: Read description, evaluate, and suggest category
export async function getAISuggestions(userDescription: string): Promise<AISuggestion | null>{
    try {
        // Better prompt for neural-chat model
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

        const response = await fetch(OLLAMA_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: MODEL,
            prompt: prompt,
            stream: false,
            temperature: 0.3
          }) 
        });

        if(!response.ok){
            const errorText = await response.text();
            console.error('Ollama API error:', response.status, response.statusText);
            console.error('Error details:', errorText);
            console.error('Make sure Ollama is running with: ollama serve');
            console.error('And model is installed with: ollama pull mistral');
            return null;
        }

        const data = await response.json()
        const responseText = data.response.trim()
        
        // Extract first JSON object more carefully
        let jsonMatch = responseText.match(/\{[^{}]*(?:"[^"]*"[^{}]*)*\}/);
        
        // If no simple JSON, try to find any curly braces
        if (!jsonMatch) {
          jsonMatch = responseText.match(/\{[\s\S]*\}/);
        }
        
        if (!jsonMatch) {
          console.error('No JSON found in response, attempting to parse plain text:', responseText);
          // Try to parse plain text response as fallback
          try {
            const categoryMatch = responseText.match(/Category:\s*(.+?)(?:\n|$)/i);
            const descMatch = responseText.match(/Description:\s*(.+?)(?:\n|$)/i);
            const reasonMatch = responseText.match(/Reasoning:\s*(.+?)(?:\n|$)/i);
            
            if (!categoryMatch) return null;
            
            return {
              category: categoryMatch[1].trim(),
              description: descMatch ? descMatch[1].trim() : 'No description provided',
              confidence: 0.7,
              reasoning: reasonMatch ? reasonMatch[1].trim() : 'Based on the description provided'
            };
          } catch (e) {
            console.error('Failed to parse plain text response:', e);
            return null;
          }
        }

        let parsed;
        try {
          // Try to clean and parse JSON
          let jsonStr = jsonMatch[0];
          console.log('Raw JSON match:', jsonStr);
          
          // Fix common typos from the AI model
          jsonStr = jsonStr.replace(/"categoory"/g, '"category"'); // Fix common typo
          jsonStr = jsonStr.replace(/"descRIPTION"/g, '"description"'); // Fix case issues
          jsonStr = jsonStr.replace(/"description"/g, '"description"'); // Normalize
          
        
          // Remove stray single quotes
          jsonStr = jsonStr.replace(/'/g, '"');

        // Remove trailing commas
        jsonStr = jsonStr.replace(/,\s*}/g, '}');
        jsonStr = jsonStr.replace(/,\s*]/g, ']');
                
        // Replace undefined / NaN
        jsonStr = jsonStr.replace(/:\s*undefined/g, ': null');
        jsonStr = jsonStr.replace(/:\s*NaN/g, ': 0.5');

        // Escape internal quotes ONLY inside values
        jsonStr = jsonStr.replace(/:\s*"([^"]*)"/g, (match, p1) => {
          const fixed = p1.replace(/"/g, '\\"');
          return `: "${fixed}"`;
        });

        // Remove newlines inside strings
        jsonStr = jsonStr.replace(/"\s*:\s*"([^"]*[\n\r][^"]*)"/g, (m, p1) => {
          return `: "${p1.replace(/[\n\r]/g, ' ')}"`;
        });
          
          console.log('Cleaned JSON:', jsonStr);
          parsed = JSON.parse(jsonStr);
        } catch (parseError) {
          console.error('Failed to parse JSON, trying AI fallback:', parseError);
          
          // Fallback: intelligently categorize based on keywords
          const lowerDesc = userDescription.toLowerCase();
          let suggestedCategory = 'Other';
          
          if (lowerDesc.includes('trash') || lowerDesc.includes('garbage') || lowerDesc.includes('litter')) {
            suggestedCategory = 'Litter';
          } else if (lowerDesc.includes('graffiti') || lowerDesc.includes('spray') || lowerDesc.includes('paint')) {
            suggestedCategory = 'Graffiti';
          } else if (lowerDesc.includes('broken') || lowerDesc.includes('pothole') || lowerDesc.includes('damaged') || lowerDesc.includes('infrastructure')) {
            suggestedCategory = 'Infrastructure Issue';
          } else if (lowerDesc.includes('overgrown') || lowerDesc.includes('weeds') || lowerDesc.includes('trees') || lowerDesc.includes('bushes')) {
            suggestedCategory = 'Overgrowth';
          } else if (lowerDesc.includes('vandal') || lowerDesc.includes('broken glass')) {
            suggestedCategory = 'Vandalism';
          }
          
          return {
            category: suggestedCategory,
            description: userDescription,
            confidence: 0.6,
            reasoning: 'AI categorization unavailable, using keyword matching'
          };
        }
        
        // Handle both "description" and typo "descripition"
        const description = parsed.description || parsed.descripition || userDescription;
        
        // Normalize category name (handle lowercase variations)
        const normalizeCategory = (cat: string | undefined): string => {
          if (!cat) return 'Other';
          const normalized = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
          return VALID_CATEGORIES.find(c => c.toLowerCase() === normalized.toLowerCase()) || 'Other';
        };

        const validCategory = normalizeCategory(parsed.category);

        console.log(parsed)
        return {
          category: validCategory,
          description: description,
          confidence: Math.min(1, Math.max(0, parseFloat(parsed.confidence) || 0.5)),
          reasoning: parsed.reasoning || 'Based on the description provided'
        }
    } catch (error) {
        console.error('AI SERVICE ERROR:',error)
        return null;
    }
    
} 