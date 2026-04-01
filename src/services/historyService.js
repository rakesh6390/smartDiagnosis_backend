const { DiagnosisHistory } = require("../models/DiagnosisHistory");

function toPositiveInt(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  const i = Math.floor(n);
  return i > 0 ? i : fallback;
}

async function listHistory({ page, limit, q }) {
  const safePage = toPositiveInt(page, 1);
  const safeLimit = Math.min(toPositiveInt(limit, 10), 100);
  const skip = (safePage - 1) * safeLimit;

  const filter = {};
  if (typeof q === "string" && q.trim()) {
    filter.$or = [
      { symptomsNormalized: { $regex: q.trim(), $options: "i" } },
      { symptomsRaw: { $regex: q.trim(), $options: "i" } }
    ];
  }

  const [items, total] = await Promise.all([
    DiagnosisHistory.find(filter).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
    DiagnosisHistory.countDocuments(filter)
  ]);

  return {
    page: safePage,
    limit: safeLimit,
    total,
    items: items.map((d) => ({
      id: d._id.toString(),
      symptomsRaw: d.symptomsRaw,
      symptomsNormalized: d.symptomsNormalized,
      diagnosis: d.diagnosis,
      createdAt: d.createdAt
    }))
  };
}

module.exports = { listHistory };

