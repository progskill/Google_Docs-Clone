const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Document = require("./models/Document");
const bodyParser = require("body-parser");
const path = require("path");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../client")));

// Route to server index.html for the root URL

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server started on port:  ${PORT}`));
