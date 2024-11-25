// const app = require("./app");
// const Databaseconnec = require("./Db/Dbconnection");
// const dotenv = require ("dotenv");

// dotenv.config()

//   // Log the loaded environment variables



// process.on('uncaughtException',err=>{
//   console.log(`ERROR:${err.message}`);
//   console.log('Shutting down the server due to Uncaught Exception');
//   process.exit(1)
// })



// const port = process.env.PORT || 3001;

// Databaseconnec().then(()=>{
// app.listen(port || 3001 ,()=>{
//   console.log(`Server is running on port ${port}`);

// });
// }).catch(error=>{
//   console.error("Error connecting to database:", error);
//   process.exit(1);
// })


// process.on('unhandledRejection',err=>{
//   console.log(`ERROR:${err.message}`);
//   console.log('Shutting down the server due to Unhandled Promise Rejection');
//   server.close(()=>{
//       process.exit(1)
//   })
// })


const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const http = require("http");
const { Server } = require("socket.io");
const os = require("os");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

server.listen(3001, () => {
  console.log(`Server is running on port 3001`);
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

// Global error handling middleware for Express
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const allSectionObject = {};

const createWhatsappSection = (id, socket) => {
  const client = new Client({
    puppeteer: {
      headless: true,  // Run in headless mode
      executablePath: os.platform() === 'win32' ? "C:/Program Files/Google/Chrome/Application/chrome.exe" :
                        os.platform() === 'darwin' ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" :
                        "/usr/bin/google-chrome" // or "/usr/bin/chromium-browser"
    },
    authStrategy: new LocalAuth({
      clientId: id,
    }),
  });

  client.on("qr", (qr) => {
    console.log("QR received", qr);
    socket.emit("qr", { qr });
  });

  client.on("authenticated", () => {
    console.log("Authenticated");
  });

  client.on("ready", () => {
    console.log("Client is ready");
    allSectionObject[id] = client;
    socket.emit("ready", { id, message: "WhatsApp client is ready" });
  });

  client.on("auth_failure", (message) => {
    console.error("Authentication failed:", message);
    socket.emit("error", { message: "Authentication failed" });
  });

  client.on("disconnected", (reason) => {
    console.log("Client disconnected:", reason);
    delete allSectionObject[id];
  });

  client.on("error", (error) => {
    console.error("WhatsApp client error:", error);
    socket.emit("error", { message: "WhatsApp client error", error: error.message });
  });

  client.initialize().catch(error => {
    console.error("Failed to initialize WhatsApp client:", error);
    socket.emit("error", { message: "Failed to initialize WhatsApp client", error: error.message });
  });
};

const formatPhoneNumber = (number) => {
  return number.replace(/[^\d]/g, ""); // remove non-numeric characters
};

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("connected", (data) => {
    console.log("User connected", data);
    socket.emit("hello", "hello from server");
  });

  socket.on("createSection", (data) => {
    const { id } = data;
    try {
      createWhatsappSection(id, socket);
    } catch (error) {
      console.error("Error creating WhatsApp section:", error);
      socket.emit("error", { message: "Error creating WhatsApp section", error: error.message });
    }
  });

  socket.on("sendMessage", async (data) => {
    const { id, number, message } = data;
    const client = allSectionObject[id];
    const formattedNumber = formatPhoneNumber(number);

    if (client) {
      try {
        await client.sendMessage(`${formattedNumber}@c.us`, message);
        socket.emit("messageStatus", { status: "Message sent" });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("messageStatus", { status: "Failed to send message", error: error.message });
      }
    } else {
      console.error("Client not found for id:", id);
      socket.emit("messageStatus", { status: "Client not found" });
    }
  });

  socket.on("error", (error) => {
    console.error("Socket.IO error:", error);
    socket.emit("error", { message: "Socket.IO error", error: error.message });
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
});

module.exports = app;
