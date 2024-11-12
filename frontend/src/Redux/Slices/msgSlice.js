// AuthSlice.js
import { createSlice } from "@reduxjs/toolkit";

const msgSlice = createSlice({
  name: "messages",
  initialState: {
    conversation: null,
    lodingConvo: false,
    allMessages: null,
    selectedContact: null,
  },
  reducers: {
    setConversation: (state, action) => {
      state.conversation = action.payload;
    },

    setLoadingConvo: (state, action) => {
      state.lodingConvo = action.payload;
    },
    setAllMessages: (state, action) => {
      state.allMessages = action.payload;
    },
    setSelectedContact: (state, action) => {
      state.selectedContact = action.payload;
    },
  },
});

export const {
  setConversation,
  setLoadingConvo,
  setAllMessages,
  setSelectedContact,
} = msgSlice.actions;
export default msgSlice.reducer;
