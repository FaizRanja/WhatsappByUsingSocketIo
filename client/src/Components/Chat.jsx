import React from 'react';
import SendMessage from './SendMessage';

const Chat = ({ sectionId }) => {
  const handleSendMessage = (message) => {
    console.log('Message sent:', message);
    // Add your send message logic here
  };

  return (
    <>
      <div>
        <h2>Chat </h2>
        <SendMessage sectionId={sectionId} />
      </div>
    </>
  );
};

export default Chat;
