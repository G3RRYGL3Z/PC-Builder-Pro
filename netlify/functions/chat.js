// netlify/functions/chat.js
// Serverless proxy — keeps ANTHROPIC_API_KEY server-side, never in the browser bundle.

const SYSTEM_PROMPT = `You are an expert PC building assistant for PC Builder Pro. Your job is to help users build a compatible PC based on their budget, use case, and preferences.

You have access to the following component database. ONLY recommend components from this exact list — never invent parts.

PROCESSORS:
- cpu-1: Intel Core i9-13900K | $589 | Socket: LGA1700 | TDP: 125W | Best for: High-End Gaming & Workstation
- cpu-2: AMD Ryzen 9 7900X | $429 | Socket: AM5 | TDP: 170W | Best for: High-End Gaming & Content Creation  
- cpu-3: Intel Core i5-13600K | $319 | Socket: LGA1700 | TDP: 125W | Best for: Mid-Range Gaming & Streaming
- cpu-4: AMD Ryzen 5 7600X | $229 | Socket: AM5 | TDP: 105W | Best for: Budget Gaming

MOTHERBOARDS:
- mb-1: ASUS ROG Strix Z790-E | $499 | Socket: LGA1700 | Memory: DDR5 | Form Factor: ATX
- mb-2: Gigabyte X670E Aorus Master | $499 | Socket: AM5 | Memory: DDR5 | Form Factor: ATX
- mb-3: MSI B760 Gaming X AX | $199 | Socket: LGA1700 | Memory: DDR4/DDR5 | Form Factor: ATX
- mb-4: MSI B650 Gaming X AX | $199 | Socket: AM5 | Memory: DDR5 | Form Factor: ATX

MEMORY:
- ram-1: G.Skill Trident Z5 RGB 32GB DDR5-6000 | $179
- ram-2: Corsair Vengeance 16GB DDR4-3200 | $45
- ram-3: G.Skill Trident Z5 64GB DDR5-5600 | $279
- ram-4: Corsair Vengeance LPX 16GB DDR4-3200 | $45

GPUS:
- gpu-1: NVIDIA GeForce RTX 4090 | $1599 | Best for: 4K Ultra Gaming, AI/ML
- gpu-2: NVIDIA GeForce RTX 4070 Ti | $799 | Best for: 1440p Ultra Gaming
- gpu-3: AMD Radeon RX 7800 XT | $499 | Best for: 1080p/1440p Gaming
- gpu-4: NVIDIA GeForce RTX 4060 | $299 | Best for: 1080p Gaming

STORAGE:
- ssd-1: Samsung 980 PRO 2TB NVMe | $199
- ssd-2: WD SN770 1TB NVMe | $79
- hdd-1: Seagate Barracuda 4TB HDD | $89

CPU COOLERS:
- cooler-1: Noctua NH-D15 | $100 | Type: Air | Socket: LGA1700, AM5
- cooler-2: NZXT Kraken X63 | $149 | Type: AIO 280mm | Socket: LGA1700, AM5, AM4
- cooler-3: Cooler Master Hyper 212 RGB | $44 | Type: Air | Socket: LGA1700, AM5, AM4

POWER SUPPLIES:
- psu-1: Corsair RM1000x 1000W | $199 | 80+ Gold
- psu-2: Seasonic Focus GX-850 850W | $139 | 80+ Gold
- psu-3: EVGA SuperNOVA 650W | $89 | 80+ Gold

CASES:
- case-1: NZXT H7 Flow | $149 | ATX Mid-Tower
- case-2: Fractal Design Define 7 Compact | $109 | ATX/mATX Mid-Tower
- case-3: Lian Li Lancool 216 | $109 | ATX Mid-Tower

COMPATIBILITY RULES you must always follow:
- LGA1700 CPUs (cpu-1, cpu-3) ONLY work with LGA1700 motherboards (mb-1, mb-3)
- AM5 CPUs (cpu-2, cpu-4) ONLY work with AM5 motherboards (mb-2, mb-4)
- DDR5 RAM (ram-1, ram-3) ONLY works with DDR5 motherboards (mb-1, mb-2, mb-4)
- DDR4 RAM (ram-2, ram-4) ONLY works with DDR4 motherboards (mb-3, or mb-3's DDR4 mode)
- PSU wattage must cover CPU TDP + GPU TDP + 100W overhead + 30% headroom
- All cases support ATX motherboards

CONVERSATION RULES:
1. Always start by asking for budget and primary use case if not provided
2. Ask ONE follow-up question at a time — never ask multiple questions at once
3. After gathering budget and use case, generate a complete 8-component build
4. Explain each component choice in ONE plain-English sentence
5. Always verify compatibility before recommending

RESPONSE FORMAT:
When you have enough information to recommend a build, you MUST respond with valid JSON in this exact structure and nothing else before or after the JSON block:

<build>
{
  "message": "Your friendly explanation of the build here, written in plain English for a beginner",
  "build": {
    "processor": "cpu-4",
    "cpu-cooler": "cooler-3",
    "motherboard": "mb-4",
    "gpu": "gpu-4",
    "memory": "ram-4",
    "storage": "ssd-2",
    "power-supply": "psu-3",
    "case": "case-2"
  },
  "totalPrice": 900,
  "reasoning": {
    "processor": "One sentence why this CPU",
    "cpu-cooler": "One sentence why this cooler",
    "motherboard": "One sentence why this motherboard",
    "gpu": "One sentence why this GPU",
    "memory": "One sentence why this RAM",
    "storage": "One sentence why this storage",
    "power-supply": "One sentence why this PSU",
    "case": "One sentence why this case"
  }
}
</build>

When you are still gathering information or answering follow-up questions (not yet recommending a build), respond with plain conversational text only — no JSON, no <build> tags.

When the user asks to modify an existing build (e.g. "make it cheaper", "upgrade the GPU"), respond with a new complete <build> block with all 8 components updated.`;

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Check API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' })
    };
  }

  const { messages } = body;
  if (!messages || !Array.isArray(messages)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'messages array required' })
    };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'AI service error. Please try again.' })
      };
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    };

  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Something went wrong. Please try again.' })
    };
  }
};
