const socket = io();
const backBtn = document.getElementById("back-btn");

const urlParams = new URLSearchParams(window.location.search);
const docId = urlParams.get("docId");

// Fetch document content
fetch(`/api/docs/${docId}`)
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("document-title").textContent = data.title;
    CKEDITOR.instances.editor.setData(data.content);
  })
  .catch((error) => {});

// Initialize CKEditor
CKEDITOR.replace("editor");
const editor = CKEDITOR.instances.editor;

editor.on("change", function () {
  const content = editor.getData();

  // Emit the changes to other clients
  socket.emit("edit", {
    docId,
    content,
  });

  // Save content to the server
  fetch(`/api/docs/${docId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
});

// Listen for real-time updates
socket.emit("join", docId);
socket.on("receiveEdit", (content) => {
  editor.setData(content);
});

backBtn.onclick = () => {
  window.location.href = "/";
};
