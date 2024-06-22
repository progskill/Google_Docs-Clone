const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Document = require("./models/Document");
const docRoutes = require("./routes/docRoutes");
const bodyParser = require("body-parser");
const path = require("path");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../client")));

app.use("/api/docs", docRoutes);

// Route to server index.html for the root URL

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.post("/api/docs/:id", async (req, res) => {
  const { title } = req.body;
  const newDocument = new Document({ title, content: "" });
  await newDocument.save();
  res.json(newDocument);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server started on port:  ${PORT}`));
