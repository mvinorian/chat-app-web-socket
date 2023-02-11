import { WebSocketServer } from "ws";
import http from "http";

const app = http.createServer();
const wss = new WebSocketServer({ server: app });
const PORT = 8080;

app.listen(PORT, () =>
  console.log(`Server running on: http://localhost:${PORT}`)
);

let clientId = 0;
let clients = [];

let chatId = 1;
let chats = [
  {
    id: chatId.toString(),
    sender: "Admin",
    message: "This is the start of the chat room.",
  },
];

const postChat = (chat) => {
  chats.push({ id: (++chatId).toString(), ...chat });
};

const updateChat = (updatedChat) => {
  chats.forEach((chat) => {
    if (chat.id === updatedChat.id) {
      chat.sender = updatedChat.sender;
      chat.message = updatedChat.message;
    }
  });
};

const deleteChat = (chatId) => {
  chats = chats.filter((chat) => chat.id !== chatId);
};

const broadcastChats = () => {
  clients.forEach((client) => {
    const socket = client.socket;
    socket.send(JSON.stringify(chats));
  });
};

const handleMessage = (data) => {
  data.method === "post" && postChat(data.data);
  data.method === "update" && updateChat(data.data);
  data.method === "delete" && deleteChat(data.data.id);
  broadcastChats();
};

const handleDisconnect = (userId) => {
  clients = clients.filter((client) => client.id !== userId);
  console.log(`User ${userId} disconnected`);
};

wss.on("connection", (socket) => {
  const userId = (++clientId).toString();

  socket.send(JSON.stringify(chats));
  clients.push({ id: userId, socket });
  console.log(`User ${userId} connected`);

  socket.on("message", (message) => handleMessage(JSON.parse(message)));
  socket.on("close", () => handleDisconnect(userId));
});
