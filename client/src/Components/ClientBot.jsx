import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import QRCode from "react-qr-code";
import { Container, Box, Typography, TextField, Button, Paper } from "@mui/material";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function ClientBot() {
  const [qrCode, setQrCode] = useState("");
  const [section, setSection] = useState("");
  const [id, setId] = useState("");

  const createWhatsappSection = () => {
    socket.emit("createSection", {
      id: section,
    });
  };

  useEffect(() => {
    socket.emit("connected", "Hello From Client");

    socket.on("qr", (data) => {
      const { qr } = data;
      setQrCode(qr);
    });

    socket.on("ready", (data) => {
      console.log(data);
      setId(data.id);
      setQrCode(""); // Clear QR code when client is ready
    });

    socket.on("error", (data) => {
      console.error(data.message);
    });

    return () => {
      socket.off("connect");
      socket.off("qr");
      socket.off("ready");
      socket.off("messageStatus");
      socket.off("error");
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Box my={4} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          WhatsApp Web Client
        </Typography>
        <Typography variant="h6" component="h4" gutterBottom>
          Please Open WhatsApp and scan the QR Code
        </Typography>
        <Paper elevation={3} style={{ padding: "16px", marginBottom: "16px" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Create Section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              style={{ marginBottom: "16px" }}
            />
          <Button
            variant="contained"
            color="primary"
            onClick={createWhatsappSection}
            fullWidth
            disabled={section.trim() === ""}
          >
            Create Section
          </Button>
        </Paper>

        {id !== "" && (
          <Paper elevation={3} style={{ padding: "16px", marginBottom: "16px" }}>
            <Chat sectionId={id} />
          </Paper>
        )}

        {qrCode && (
          <Paper elevation={3} style={{ padding: "16px", marginBottom: "16px" }}>
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={qrCode}
              viewBox={`0 0 256 256`}
            />
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default ClientBot;
