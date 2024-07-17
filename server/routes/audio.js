const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Audio = require("../models/Audio");
const auth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/app/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "audio/mpeg") {
      return cb(new Error("Only mp3 files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Upload audio route
router.post("/upload", auth, upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File uploaded:", req.file);
    console.log("Request body:", req.body);

    const newAudio = new Audio({
      filename: req.file.filename,
      originalName: req.file.originalname,
      description: req.body.description,
      category: req.body.category,
      userId: req.user._id,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
    });

    console.log("New audio object:", newAudio);

    await newAudio.save();
    res.status(201).json(newAudio);
  } catch (error) {
    console.error("Error uploading audio:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Get audio list
router.get("/list", auth, async (req, res) => {
  try {
    const audios = await Audio.find({ userId: req.user._id }).select(
      "-filePath -mimeType"
    );
    res.json({
      username: req.user.username,
      audios: audios,
    });
  } catch (error) {
    console.error("Error fetching audio files:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching audio files" });
  }
});

// Get audio details
router.get("/:id", auth, async (req, res) => {
  try {
    const audio = await Audio.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!audio) {
      return res.status(404).json({ error: "Audio not found" });
    }
    res.json(audio);
  } catch (error) {
    console.error("Error fetching audio details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching audio details" });
  }
});

// Stream audio file
router.get("/stream/:id", auth, async (req, res) => {
  try {
    console.log("Streaming audio with ID:", req.params.id);
    const audio = await Audio.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!audio) {
      console.log("Audio not found for ID:", req.params.id);
      return res.status(404).json({ error: "Audio not found" });
    }

    console.log("Audio found:", audio);
    const filePath = audio.filePath;
    console.log("File path:", filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Audio file not found" });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": audio.mimeType,
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": audio.mimeType,
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error("Error streaming audio:", error);
    res
      .status(500)
      .json({ error: "An error occurred while streaming the audio file" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { description, category } = req.body;
    const audio = await Audio.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!audio) {
      return res.status(404).json({ error: "Audio not found" });
    }

    audio.description = description;
    audio.category = category;
    await audio.save();

    res.json(audio);
  } catch (error) {
    console.error("Error updating audio details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating audio details" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const audio = await Audio.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!audio) {
      return res.status(404).json({ error: "Audio not found" });
    }

    await Audio.deleteOne({ _id: req.params.id });

    // Optionally, delete the file from the server
    const filePath = path.join("/app", audio.filePath);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });

    res.json({ message: "Audio deleted successfully" });
  } catch (error) {
    console.error("Error deleting audio:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the audio" });
  }
});

module.exports = router;
