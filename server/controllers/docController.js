// server/controllers/docController.js
const Document = require("../models/Document");

exports.createDocument = async (req, res) => {
  const { title, content } = req.body;
  const owner = req.user.id;

  try {
    const newDoc = new Document({
      title,
      content,
      owner,
      versionHistory: [{ content }],
    });

    const document = await newDoc.save();
    res.json(document);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ owner: req.user.id });
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
