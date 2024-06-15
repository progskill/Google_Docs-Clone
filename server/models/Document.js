const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    versionHistory: [
      {
        contect: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);
