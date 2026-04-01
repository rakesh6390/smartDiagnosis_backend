const { env } = require("./env");

const diagnosisSchema = {
  type: "object",
  properties: {
    possible_conditions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          reasoning: { type: "string" },
          urgency: {
            type: "string",
            enum: ["low", "medium", "high"]
          }
        },
        required: ["name", "reasoning", "urgency"]
      }
    },
    recommended_next_steps: {
      type: "array",
      items: { type: "string" }
    },
    red_flags: {
      type: "array",
      items: { type: "string" }
    },
    disclaimer: { type: "string" }
  },
  required: [
    "possible_conditions",
    "recommended_next_steps",
    "red_flags",
    "disclaimer"
  ]
};

async function generateDiagnosis(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(env.GEMINI_MODEL)}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseJsonSchema: diagnosisSchema
        }
      })
    }
  );

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data?.error?.message || `Gemini API request failed with status ${response.status}.`;
    const err = new Error(message);
    err.statusCode = response.status === 429 ? 429 : 502;
    throw err;
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!text) {
    const err = new Error("Gemini returned an empty response.");
    err.statusCode = 502;
    throw err;
  }

  return text;
}

module.exports = { generateDiagnosis };
