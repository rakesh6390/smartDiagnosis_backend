const mongoose = require("mongoose");

const DiagnosisHistorySchema = new mongoose.Schema(
  {
    symptomsRaw: { type: String, required: true },
    symptomsNormalized: { type: String, required: true, index: true },
    diagnosis: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

DiagnosisHistorySchema.index({ createdAt: -1 });

const DiagnosisHistory =
  mongoose.models.DiagnosisHistory ||
  mongoose.model("DiagnosisHistory", DiagnosisHistorySchema);

module.exports = { DiagnosisHistory };

