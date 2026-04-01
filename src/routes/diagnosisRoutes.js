const express = require("express");

const { asyncHandler } = require("../utils/asyncHandler");
const { diagnoseController } = require("../controllers/diagnosisController");

const router = express.Router();

router.post("/", asyncHandler(diagnoseController));

module.exports = router;

