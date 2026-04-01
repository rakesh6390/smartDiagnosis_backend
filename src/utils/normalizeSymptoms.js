function normalizeSymptoms(input) {
  if (typeof input !== "string") return "";

  return input
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .filter((s, idx, arr) => arr.indexOf(s) === idx)
    .join(", ");
}

module.exports = { normalizeSymptoms };

