import OpenAI from 'openai';

const openRouterKey = process.env.OPENROUTER_API_KEY;
const openaiKey = process.env.OPENAI_API_KEY;
let client: any;
let modelName = 'gpt-4o-mini';

if (openRouterKey) {
  client = new OpenAI({ apiKey: openRouterKey, baseURL: 'https://api.openrouter.ai/v1' as any });
  modelName = 'gemini-4o-mini';
} else if (openaiKey) {
  client = new OpenAI({ apiKey: openaiKey });
  modelName = 'gpt-4o-mini';
} else {
  throw new Error('No OpenAI or OpenRouter API key configured');
}

export async function queryOpenAI(prompt: string) {
  try {
    const resp = await client.chat.completions.create({
      model: modelName,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500
    } as any);
    const text = resp.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    return text;
  } catch (err:any) {
    console.error('OpenAI/OpenRouter error', err);
    // Fallback: simple heuristic responses for common airport queries when AI service is unreachable
    const p = (prompt || '').toLowerCase();
    if (p.includes('baggage') || p.includes('bag') || p.includes('check in')) {
      return 'General baggage guidance: 1) Check in at the airline counter or kiosk. 2) Print/attach baggage tag. 3) Drop luggage at the designated drop-off. Allow extra time for busy airports.';
    }
    if (p.includes('layover') || p.includes('hour layover') || p.includes('lay over')) {
      return 'Layover suggestions: If you have >90 minutes, explore shops or grab a meal. For 45–90 minutes, consider a quick lounge or meal but head to gate early. For <45 minutes, stay near the gate and skip stops.';
    }
    if (p.includes('first-time') || p.includes('first time') || p.includes('what should i do after entering')) {
      return 'First-time flyer tips: Arrive early (2 hours domestic), check-in or use kiosks, clear security (have ID and liquids guidelines ready), find your gate on the departure board.';
    }
    return 'Sorry — the AI service is currently unreachable; please try again later or use the Transit Planner and Luggage Guidance pages for immediate help.';
  }
}
