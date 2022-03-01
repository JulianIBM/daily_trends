const express = require("express");

const FeedController = require("../controllers/feeds");

const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", extractFile, FeedController.createFeed);

router.get("", FeedController.getFeeds);

router.get("/:id", FeedController.getFeed);

router.put("/:id", extractFile, FeedController.updateFeed);

router.delete("/:id", FeedController.deleteFeed);

router.delete("", FeedController.deleteScrapedFeeds);

module.exports = router;
