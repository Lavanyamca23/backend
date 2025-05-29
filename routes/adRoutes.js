const express = require("express");
const multer = require("multer");
const Advertisement = require("../models/Advertisement");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/", upload.array("images"), async (req, res) => {
  const { category, heading, content } = req.body;
  const images = req.files.map((file) => file.filename);
  const ad = new Advertisement({ category, heading, content, images });
  await ad.save();
  res.send(ad);
});

router.get("/", async (req, res) => {
  const ads = await Advertisement.find();
  res.send(ads);
});

router.put("/:id", upload.array("images"), async (req, res) => {
  const { category, heading, content } = req.body;
  const images = req.files.map((file) => file.filename);
  const updated = await Advertisement.findByIdAndUpdate(
    req.params.id,
    { category, heading, content, ...(images.length > 0 && { images }) },
    { new: true }
  );
  res.send(updated);
});

router.delete("/:id", async (req, res) => {
  await Advertisement.findByIdAndDelete(req.params.id);
  res.send({ message: "Deleted" });
});

module.exports = router;
