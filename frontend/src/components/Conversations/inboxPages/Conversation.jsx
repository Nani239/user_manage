//Conversations
import React from "react";
import "./messages.css";
import { useSelector } from "react-redux";

function Conversation({ message }) {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const userId = user.UserID;
  console.log(message, "conversation");
  function convertTo12HourFormat(time24) {
    if (!time24) {
      return "";
    }
    const [hour24, minute] = time24.split(":").map(Number);
    if (isNaN(hour24) || isNaN(minute)) {
      return "";
    }
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = (hour24 % 12 || 12).toString().padStart(2, "0"); // Added padStart
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
  }

  function formatDate(inputDate) {
    let date = new Date(inputDate);
    let monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    let year = date.getFullYear();
    let month = monthNames[date.getMonth()];
    let day = date.getDate();
    let formattedDay = day < 10 ? "0" + day : day;
    let formattedDate = `${month} ${formattedDay}, ${year}`;
    return formattedDate;
  }
  function renderAttachment() {
    const photoUrl = message.Photo;
    if (!photoUrl) return null;

    const fileExtension = photoUrl?.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) {
      return (
        <img
          src={photoUrl}
          alt="attachment"
          className="attachment-image"
          style={{ width: "200px", height: "auto" }} // Adjust size as needed
        />
      );
    } else if (["mp4", "webm", "ogg"].includes(fileExtension)) {
      return (
        <video
          controls
          className="attachment-video"
          style={{ width: "300px", height: "auto" }} // Adjust size as needed
        >
          <source src={photoUrl} type={`video/${fileExtension}`} />
        </video>
      );
    } else if (fileExtension === "pdf") {
      return (
        <div>
          <iframe
            src={photoUrl}
            width="100%"
            height="500" // Adjust height as needed
            frameBorder="0"
            scrolling="no"
          />
        </div>
      );
      // return (
      //   <div>

      //     <a
      //       href={photoUrl}
      //       target="_blank"
      //       rel="noopener noreferrer"
      //       style={{ fontSize: "16px" }} // Optional: Adjust font size for the link
      //       className="attachment-link"
      //       download
      //       onClick={() => {
      //         window.open(photoUrl);
      //       }}
      //     >
      //       View PDF
      //     </a>
      //   </div>
      // );
    }
    return null;
  }
  console.log(message, "conversation");
  return (
    <div
      className={`chat-message ${
        message.createdBy === userId ? "own" : "other"
      } `}
    >
      <div className="message-content">
        <div className="avatar d-flex align-items-center mb-1">
          <img
            src={
              message?.createdBy === user?.UserID
                ? message?.customerProfilePhoto &&
                  message?.customerProfilePhoto.trim() !== ""
                  ? message.customerProfilePhoto
                  : "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
                : message?.providerProfilePhoto &&
                  message?.providerProfilePhoto.trim() !== ""
                ? message.providerProfilePhoto
                : "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
            }
            alt="Avatar"
            className="rounded-circle border border-1 border-secondary bg-light avatar shadow p-1 d-inline-block"
            width={30}
            height={30}
          />
          <div className="sender mt-1" style={{ fontSize: "14px" }}>
            {message?.senderName}
          </div>
        </div>

        {message?.postType != 4 && (
          <p
            className="my-2 p-0 text-dark"
            style={{ fontSize: "medium" }}
            dangerouslySetInnerHTML={{
              __html:
                message.Message ||
                message.messageComment ||
                message.giftDescription ||
                "",
            }}
          />
        )}
        {message?.postType == 4 && (
          <div>
            <p
              className="my-2 p-0 text-dark attachment-title"
              style={{ fontSize: "medium" }}
              dangerouslySetInnerHTML={{
                __html:
                  (
                    message.Message ||
                    message.messageComment ||
                    message.giftDescription ||
                    ""
                  ).length > 20
                    ? (
                        message.Message ||
                        message.messageComment ||
                        message.giftDescription ||
                        ""
                      ).substring(0, 20) + "..."
                    : message.Message ||
                      message.messageComment ||
                      message.giftDescription ||
                      "",
              }}
            />
            {renderAttachment()}
          </div>
        )}

        <div
          className={`time text-datk mt-1 ${
            message.createdBy === userId ? "me-1" : "ms-1"
          }`}
        >
          <span className="me-2">
            {formatDate(message.createdAt.split("T")[0])}
          </span>
          <span>{convertTo12HourFormat(message.createdAt.split("T")[1])}</span>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
