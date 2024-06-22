const express = require("express");
const router = express.Router();
const Document = require("../models/Document");

// Create router for create document

router.post("/create", async (req, res) => {
  const { title } = req.body;
  const newDocument = new Document({ title, content: "" });
  await newDocument.save();
  res.status(201).json(newDocument);
});

// Get All Documents

router.get("/", async (req, res) => {
  const documents = await Document.find({});
  res.json(documents);
});

module.exports = router;
