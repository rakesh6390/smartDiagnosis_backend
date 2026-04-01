const express = require("express");

const { asyncHandler } = require("../utils/asyncHandler");
const { historyController } = require("../controllers/historyController");

const router = express.Router();

router.get("/", asyncHandler(historyController));

module.exports = router;

