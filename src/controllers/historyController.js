const { listHistory } = require("../services/historyService");

async function historyController(req, res) {
  const result = await listHistory({
    page: req.query?.page,
    limit: req.query?.limit,
    q: req.query?.q
  });
  res.status(200).json(result);
}

module.exports = { historyController };

