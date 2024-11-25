import React, { useState } from "react";
import axios from "axios";

const CreateSection = () => {
  const [qrCode, setQrCode] = useState(null);
  const [messageStatus, setMessageStatus] = useState("");

  const createSection = async (id) => {
    try {
      const response = await axios.post("http://localhost:3001/createSection", { id });
      setQrCode(response.data.qr);
      console.log("QR Code received:", response.data.qr);
    } catch (error) {
      console.error("Error creating section:", error);
    }
  };

  const sendMessage = async (id, number, message) => {
    try {
      const response = await axios.post("http://localhost:3001/sendMessage", { id, number, message });
      setMessageStatus(response.data.status);
      console.log("Message status:", response.data.status);
    } catch (error) {
      setMessageStatus("Failed to send message");
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <h1>WhatsApp Integration</h1>
      <button onClick={() => createSection("your-client-id")}>Create WhatsApp Section</button>
      {qrCode && <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${qrCode}&size=200x200`} alt="QR Code" />}
      <button onClick={() => sendMessage("your-client-id", "recipient-number", "your-message")}>Send Message</button>
      {messageStatus && <p>{messageStatus}</p>}
    </div>
  );
};

export default CreateSection;
