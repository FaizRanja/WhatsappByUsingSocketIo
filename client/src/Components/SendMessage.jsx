import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3001");

const SendMessage = ({ sectionId }) => {
  const [message, setMessage] = useState("");
  const [number, setNumber] = useState("");
  const [status, setStatus] = useState('');

  const handleSend = () => {
    if (message.trim() && number.trim()) {
      socket.emit('sendMessage', { id: sectionId, message, number });
    }
    setMessage('');
    // setNumber('');
  };

  useEffect(() => {
    socket.on("messageStatus", (data) => {
      setStatus(data.status);
      console.log(data.status);
    });

    return () => {
      socket.off("messageStatus");
    };
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={2}
      boxShadow={2}
      borderRadius={2}
      bgcolor="background.paper"
      width="100%"
      maxWidth={400}
      margin="0 auto"
    >
      <Typography variant="h6" gutterBottom>
        Send Message
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Phone Number"
        fullWidth
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        variant="outlined"
        placeholder="Type your message..."
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSend();
          }
        }}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        endIcon={<SendIcon />}
        onClick={handleSend}
        fullWidth
        disabled={message.trim() === "" || number.trim() === ""}
      >
        Send
      </Button>
      {status && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          {status}
        </Typography>
      )}
    </Box>
  );
};

export default SendMessage;
