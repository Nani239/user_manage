import React from "react";
import "./messages.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getConvoById } from "../../../components/Header/Data2";

function MessageItem({ conversation, onSelectConversation }) {
  const selectedConversation = useSelector(
    (state) => state.messages.selectedConvo
  );
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const navigate = useNavigate();
  const [latest, setLatest] = React.useState(null);
  const ViewProfile = (msg) => {
    if (msg.createdBy === user.UserID) {
      navigate(`/userDetails/${msg.customerId}`, { state: msg.ownerId });
    } else {
      navigate(`/userDetails/${msg.createdBy}`, { state: msg.ownerId });
    }
  };
  const fetchMsgs = async () => {
    const messagesData = await getConvoById(conversation?.Id);
    setLatest(messagesData[0]);
  };
  console.log(selectedConversation, "selectedConversation");
  React.useEffect(() => {
    fetchMsgs();
  }, []);
  return (
    <div
      className={`message-item ${
        conversation.messageStatus == 0 ? "unread" : ""
      } ${
        selectedConversation && selectedConversation.Id === conversation.Id
          ? "selected"
          : ""
      }`}
      onClick={() => onSelectConversation(conversation.Id)}
    >
      <hr />
      <div>
        {conversation.createdBy !== user.UserID ? (
          <>
            <img
              src={
                conversation?.senderPhoto !== null &&
                conversation?.senderPhoto !== ""
                  ? conversation?.senderPhoto
                  : "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
              }
              alt=""
              className="rounded-circle border border-1 border-secondary bg-light avatar shadow p-1 mb-1 d-inline-block"
              width={40}
              height={40}
              onClick={() => ViewProfile(conversation)}
            />
          </>
        ) : (
          <>
            <img
              src={
                conversation?.receiverProfilePhoto !== null &&
                conversation?.receiverProfilePhoto !== ""
                  ? conversation?.receiverProfilePhoto
                  : "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
              }
              onClick={() => ViewProfile(conversation)}
              alt={conversation?.userName}
              className="rounded-circle border border-1 border-secondary bg-light avatar shadow p-1 mb-1 d-inline-block"
              width={40}
              height={40}
            />
          </>
        )}
      </div>
      <div className="message-info">
        <div className="name">
          {" "}
          {conversation.createdBy === user.UserID ? (
            <strong
              // onClick={() => ViewProfile(conversation)}
              style={{ fontSize: "small", cursor: "pointer" }}
            >
              <span>{conversation?.customerName}</span>
            </strong>
          ) : (
            <strong
              style={{ fontSize: "small", cursor: "pointer" }}
              // onClick={() => ViewProfile(conversation)}
            >
              <span>{conversation?.senderName}</span>
            </strong>
          )}
        </div>
        <div className="last-message">
          {latest?.Message && latest.Message.length > 20
            ? `${latest.Message.slice(0, 20)}...`
            : latest?.Message}
        </div>
      </div>
      <div className="message-date">2024-08</div>
      {conversation.messageStatus == 0 && <div className="unread-count">9</div>}
    </div>
  );
}

export default MessageItem;
