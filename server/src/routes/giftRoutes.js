const express = require("express");
const { getGifts } = require("../controllers/giftController");
const router = express.Router();
router.get("/", getGifts);
module.exports = router;
