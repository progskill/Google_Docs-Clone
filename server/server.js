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

// EndPoint  to get a specific document By Id
// Endpoint to get a specific document by ID
app.get("/api/docs/:id", async (req, res) => {
  const { id } = req.params;
  const document = await Document.findById(id);
  res.json(document);
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", async (docId) => {
    socket.join(docId);
    console.log(`Client joined room: ${docId}`);

    // Load the document content from the database
    const document = await Document.findById(docId);
    if (document) {
      socket.emit("receiveEdit", document.content);
    }
  });

  socket.on("edit", async (data) => {
    const { docId, content } = data;

    // Save or update the document content in the database
    const document = await Document.findById(docId);
    if (document) {
      document.content = content;
      document.versionHistory.push({ content });
      await document.save();
    }

    // Broadcast the changes to other clients in the same room
    socket.to(docId).emit("receiveEdit", content);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server started on port:  ${PORT}`));
