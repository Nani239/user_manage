import React, { useEffect, useRef, useState } from "react";
import "./messages.css";
import { useDispatch, useSelector } from "react-redux";
import {
  makeCall,
  msgPhoneEmailDetail,
  sendMessage,
  sendMsgMail,
} from "../../../components/Header/Data";
import { toast } from "react-toastify";
import "./Styles/InputBox.css";
import { LiaPhoneAltSolid } from "react-icons/lia";
import { IoMdAttach } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import {
  FaDollarSign,
  FaFilePdf,
  FaImage,
  FaPhoneAlt,
  FaRegFileVideo,
  FaRegImage,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import uploadToS3 from "../../../utils/awsS3Upload";
import { GetZoomLink } from "../../../components/Header/Data2";
import { Input, Label, Modal } from "reactstrap";
import {
  setSelectedConversation,
  setSelectedFile,
  setSendingFile,
} from "../../../redux/slices/MsgSlice";

function MsgInputBox({ fetchMsgs, isChatModal }) {
  const [message, setMessage] = useState("");
  const [showAttachOptions, setShowAttachOptions] = useState(false);
  const attachOptionsRef = useRef(null); // Reference for attach-options
  const [twilioDetails, setTwilioDetails] = useState({});
  const selectedConversation = useSelector(
    (state) => state.messages.selectedConvo
  );
  const { selectedAd } = useSelector((state) => state.lcAds);
  const selectedFile = useSelector((state) => state.messages.selectedFile);
  const dispatch = useDispatch();
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleModalClick = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const handleSend = async () => {
    if (message.trim()) {
      let messageForm;
      if (selectedConversation) {
        messageForm = {
          customerId:
            selectedConversation.customerId === user.UserID
              ? selectedConversation.createdBy
              : selectedConversation.customerId,
          postId: selectedConversation.postType,
          postType: 1, // message 1 or requestQuote 2 or offer my service 3
          parentId:
            selectedConversation.parentId === 0
              ? selectedConversation.Id
              : selectedConversation.parentId,
          Description: message,
          messageStatus: 8,
          createdBy: user.UserID,
          roleId: user.RoleId,
          ownerId: selectedConversation.ownerId,
          userName: user.UserName,
          Email: user.Email,
          serviceNeed: "need",
          needName: selectedConversation.postName,
        };
      } else {
        messageForm = {
          customerId: selectedAd?.createdBy,
          postId: selectedAd?.Id,
          postType: 1, // message 1 or requestQuote 2 or offer my service 3
          Description: message,
          messageStatus: 8,
          createdBy: user.UserID,
          roleId: user.RoleId,
          ownerId: selectedAd ? selectedAd.createdBy : `0`,
          userName: user.UserName,
          Email: user.Email,
          serviceNeed: "text",
          needName: selectedAd?.Title,
        };
      }
      if (!messageForm.Description) {
        toast.error("Enter Message");
        return;
      }
      const response = await sendMessage(messageForm);
      if (response.Data) {
        let data = response.Data;
        if (data.parentId == 0) {
          dispatch(setSelectedConversation(data));
        } else {
          fetchMsgs();
        }
        setMessage("");
        toast.success("Message Sent");
      }
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents form submission or other default behavior
      handleSend();
    }
  };

  const handleClick = (e) => {
    const offerAmount =
      selectedConversation.finalBudget !== null
        ? selectedConversation.finalBudget
        : 0;
    e.stopPropagation();
    if (islogin) {
      navigate("/order/summary", {
        state: {
          selectedConversation,
          offerAmount,
        },
      });
    } else {
      navigate("/login");
      toast.info("Please Login");
    }
  };
  const fetchMsgPhoneEmailDetail = async () => {
    if (selectedConversation) {
      const responseDetail = await msgPhoneEmailDetail(
        selectedConversation?.Id
      );
      setTwilioDetails(responseDetail[0]);
    }
  };

  useEffect(() => {
    fetchMsgPhoneEmailDetail();
  }, [selectedConversation]);
  function formatDate1(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  const now = new Date();
  const formattedDate = formatDate1(now);
  const handleCallClick = async (e) => {
    e.stopPropagation();
    const phoneDetailsObj = [
      {
        email: twilioDetails?.created_by_email,
        phoneNumber: twilioDetails?.created_by_phone,
        countryCode: twilioDetails?.created_country_code,
      },
      {
        email: twilioDetails?.receiver_email,
        phoneNumber: twilioDetails?.receiver_phone,
        countryCode: twilioDetails?.receiver_country_code,
      },
      {
        email: "",
        phoneNumber:
          twilioDetails?.alternative_phone_one === null ||
          twilioDetails?.alternative_phone_one === ""
            ? ""
            : twilioDetails?.alternative_phone_one,
        countryCode:
          twilioDetails?.alternative_phone_one === null ||
          twilioDetails?.alternative_phone_one === ""
            ? ""
            : twilioDetails?.receiver_country_code,
      },
      {
        email: "",
        phoneNumber:
          twilioDetails?.alternative_phone_two === null ||
          twilioDetails?.alternative_phone_two === ""
            ? ""
            : twilioDetails?.alternative_phone_two,
        countryCode:
          twilioDetails?.alternative_phone_two === null ||
          twilioDetails?.alternative_phone_two === ""
            ? ""
            : twilioDetails?.receiver_country_code,
      },
    ];
    if (twilioDetails?.receiver_phone !== twilioDetails?.need_phone) {
      phoneDetailsObj.push({
        email: "",
        phoneNumber: twilioDetails?.need_phone || "",
        countryCode: twilioDetails?.receiver_country_code,
      });
    }
    const phoneDetails = JSON.stringify(phoneDetailsObj);
    console.log(phoneDetails, "phoneDetails");
    let formData = {
      phoneDetails: phoneDetails,
    };
    const response = await makeCall(formData);
    toast.success("Call started and Zoom link sent");
    if (response === "initiating call") {
      const formData = {
        startTime: formattedDate,
        needName: selectedConversation?.postName,
      };
      const linkResponse = await GetZoomLink(
        formData,
        selectedConversation?.Id
      );
      let formData1 = {
        zoomlink: linkResponse.join_url,
        phoneDetails: phoneDetails,
      };
      await sendMsgMail(formData1);
    } else {
      throw new Error("Response from makeCall was invalid");
    }
  };

  const handleAttach = (e) => {
    e.stopPropagation();
    setShowAttachOptions(!showAttachOptions);
  };

  const handleFileChange = (e) => {
    e.stopPropagation();
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB.");
        dispatch(setSelectedFile(null));
        return;
      }
      dispatch(setSelectedFile(file));
      setShowAttachOptions(false);
    }
  };

  const handleFileSend = async () => {
    dispatch(setSendingFile(true));
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }
    let fileUrl = null;
    if (selectedFile) {
      try {
        const folder = `converationsId_${selectedConversation?.Id}/`;
        fileUrl = await uploadToS3(selectedFile, folder); // Upload to S3 and get URL
      } catch (error) {
        console.error("Error uploading image to S3:", error);
        toast.error("Image upload failed. Please try again.");
      }
    }
    if (!fileUrl) {
      toast.error("Please select a file");
      return;
    }
    const messageForm = {
      customerId:
        selectedConversation.customerId === user.UserID
          ? selectedConversation.createdBy
          : selectedConversation.customerId,
      postId: selectedConversation.postType,
      postType: 4, // message 1 , requestQuote 2 , offer my service 3 , Attachment 4
      parentId:
        selectedConversation.parentId === 0
          ? selectedConversation.Id
          : selectedConversation.parentId,
      Description: selectedFile.name,
      messageStatus: 8,
      createdBy: user.UserID,
      roleId: user.RoleId,
      ownerId: selectedConversation.ownerId,
      userName: user.UserName,
      Email: user.Email,
      serviceNeed: selectedFile.type,
      needName: selectedConversation.postName || "Text message",
      Photo: fileUrl,
    };
    await sendMessage(messageForm);
    fetchMsgs();
    dispatch(setSelectedFile(null));
    setShowAttachOptions(false);
    dispatch(setSendingFile(false));
  };
  React.useEffect(() => {
    if (selectedFile) {
      handleFileSend();
      console.log(selectedFile, "selectedFile");
    }
  }, [selectedFile]);

  // Close attach-options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        attachOptionsRef.current &&
        !attachOptionsRef.current.contains(event.target)
      ) {
        setShowAttachOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="input-box">
      <div className="input-box-icons">
        {/* {(selectedConversation.messageStatus === 4 ||
          selectedConversation.messageStatus === 9) &&
        selectedConversation.ownerId !== user.UserID ? (
          <FaDollarSign />
        ) : selectedConversation?.orderStatus === null ? (
          <span className="" onClick={(e) => handleClick(e)}>
            <FaDollarSign />
          </span>
        ) : (
          selectedConversation?.orderStatus === "COMPLETED" && (
            <span className="text-success">
              <FaDollarSign />
            </span>
          )
        )} */}
        {!isChatModal && (
          <span
          //  onClick={handleModalClick}
          >
            <FaDollarSign />
          </span>
        )}
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
          <div>
            <Label>Title</Label>
            <Input type="text" name="title" placeholder="Title" />
          </div>
          <div>
            <Label>Descrption</Label>
            <Input type="text" name="descrption" placeholder="descrption" />
          </div>
          <div>
            <Label>Amount</Label>
            <Input type="number" name="amount" placeholder="amount" />
          </div>
          <div></div>
        </Modal>
        <span onClick={(e) => handleCallClick(e)}>
          <LiaPhoneAltSolid />
        </span>
        <span onClick={(e) => handleAttach(e)}>
          <IoMdAttach />
        </span>
      </div>

      {showAttachOptions && (
        <div className="attach-options" ref={attachOptionsRef}>
          <label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            Photo <FaImage />
          </label>
          <label>
            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            Video <FaVideo />
          </label>
          <label>
            <input
              type="file"
              name="document"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            File <FaFilePdf />
          </label>
        </div>
      )}
      <input
        type="text"
        className="input-box-input"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSend}>
        <IoSend size={25} style={{ cursor: "pointer" }} />
      </button>
    </div>
  );
}

export default MsgInputBox;
