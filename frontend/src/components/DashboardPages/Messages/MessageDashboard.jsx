import React, { useState } from 'react';
import MessageList from './MessageList';
import ChatWindow from './ChatWindow';
import { initialConversations } from './dummy';

const MessagesDashboard = () => {
    const [conversations, setConversations] = useState(initialConversations);
    const [selectedConversation, setSelectedConversation] = useState(null);

    const handleSelectConversation = (conversationId) => {
        const conversation = conversations.find(conv => conv.id === conversationId);
        setSelectedConversation(conversation);
    };
    return (
        <div className="message-container">
            <MessageList conversations={conversations} selectedConversationId={selectedConversation ? selectedConversation.id : null} onSelectConversation={handleSelectConversation} />
            {selectedConversation && <ChatWindow conversation={selectedConversation} />}
        </div>
    );
};

export default MessagesDashboard;