const { diagnose } = require("../services/diagnosisService");

async function diagnoseController(req, res) {
  const result = await diagnose({ symptoms: req.body?.symptoms });
  res.status(200).json(result);
}

module.exports = { diagnoseController };

