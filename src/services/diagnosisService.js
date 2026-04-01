const NodeCache = require("node-cache");

const { env } = require("../config/env");
const { generateDiagnosis } = require("../config/gemini");
const { DiagnosisHistory } = require("../models/DiagnosisHistory");
const { normalizeSymptoms } = require("../utils/normalizeSymptoms");

const cache = new NodeCache({ stdTTL: env.CACHE_TTL_SECONDS });

function parseDiagnosisJson(text) {
  if (typeof text !== "string" || !text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function callGeminiForDiagnosis(symptomsNormalized) {
  const prompt = [
    "You are a medical triage assistant. Output MUST be valid JSON only.",
    "",
    "Given symptoms, respond with a JSON object with exactly these keys:",
    '- "possible_conditions": array of { "name": string, "reasoning": string, "urgency": "low"|"medium"|"high" }',
    '- "recommended_next_steps": array of strings',
    '- "red_flags": array of strings',
    '- "disclaimer": string',
    "",
    `Symptoms: ${symptomsNormalized}`
  ].join("\n");

  const text = await generateDiagnosis(prompt);
  const parsed = parseDiagnosisJson(text);
  if (!parsed) {
    const err = new Error("Failed to parse Gemini response as JSON.");
    err.statusCode = 502;
    throw err;
  }
  return parsed;
}

async function diagnose({ symptoms }) {
  const symptomsRaw = typeof symptoms === "string" ? symptoms : "";
  if (!symptomsRaw.trim()) {
    const err = new Error('Body field "symptoms" is required.');
    err.statusCode = 400;
    throw err;
  }

  const symptomsNormalized = normalizeSymptoms(symptomsRaw);
  if (!symptomsNormalized) {
    const err = new Error('Body field "symptoms" must include at least one symptom.');
    err.statusCode = 400;
    throw err;
  }

  const cacheKey = `dx:${symptomsNormalized}`;
  const cached = cache.get(cacheKey);
  if (cached) return { ...cached, cached: true };

  const diagnosis = await callGeminiForDiagnosis(symptomsNormalized);

  const record = await DiagnosisHistory.create({
    symptomsRaw,
    symptomsNormalized,
    diagnosis
  });

  const result = {
    id: record._id.toString(),
    symptoms: symptomsNormalized,
    diagnosis,
    createdAt: record.createdAt
  };

  cache.set(cacheKey, result);
  return { ...result, cached: false };
}

module.exports = { diagnose };

