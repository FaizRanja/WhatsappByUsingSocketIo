import AsynicHandler from "../utils/AsynicHandler";
const { Client, LocalAuth } = require("whatsapp-web.js");
    const createWhatsappSection = AsynicHandler (id, res) => {
    const client = new Client({
      puppeteer: {
        headless: false,
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
      res.json({ qr });
    });
  
    client.on("authenticated", () => {
      console.log("Authenticated");
    });
  
    client.on("ready", () => {
      console.log("Client is ready");
      allSectionObject[id] = client;
      res.json({ id, message: "WhatsApp client is ready" });
    });
  
    client.on("auth_failure", (message) => {
      console.error("Authentication failed:", message);
      res.status(401).json({ message: "Authentication failed" });
    });
  
    client.on("disconnected", (reason) => {
      console.log("Client disconnected:", reason);
      delete allSectionObject[id];
    });
  
    client.initialize();
  };

