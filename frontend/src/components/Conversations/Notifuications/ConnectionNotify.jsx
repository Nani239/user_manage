import React from "react";
import Sidebar from "../../../SideBar";
import { Col, Row, Button } from "reactstrap";
import { FadeLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import userIcon from "../../../../assets/images/user-icon.png";
import {
  setLoadingNotif,
  setMyConnections,
} from "../../../../redux/slices/MsgSlice";
import { GetConnections } from "../../../../components/Header/Data3";
import { toast } from "react-toastify";
import axiosClient from "../../../../axios-client";
import { useNavigate } from "react-router-dom";
import ConnectionSend from "./ConnectionSend";
import ConnectionRecived from "./ConnectionRecived";

const ConnectionNotify = () => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("send");
  const { loadingNotif, myConnections } = useSelector(
    (state) => state.messages
  );
  const sendConnections = myConnections?.filter(
    (job) => job.created_by == user.UserID
  );
  const recivedConnections = myConnections?.filter(
    (job) => job.user_id == user.UserID
  );
  console.log(
    sendConnections,
    recivedConnections,
    myConnections,
    "connections"
  );
  console.log(
    sendConnections.length,
    recivedConnections.length,
    myConnections.length,
    "connections"
  );
  const fetchConnections = async () => {
    dispatch(setLoadingNotif(true));
    const response = await GetConnections(user.UserID);
    dispatch(setMyConnections(response));
    dispatch(setLoadingNotif(false));
  };
  React.useEffect(() => {
    fetchConnections();
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`?tab=${tab}`);
  };

  return (
    <section className="home-after-login bg-white">
      <div className="container">
        {loadingNotif && (
          <FadeLoader
            css={{ margin: "0 auto" }}
            color={"#36D7B7"}
            loading={loadingNotif}
            className="position-absolute top-50 start-50 translate-middle"
          />
        )}
        <div className="row">
          {myConnections && myConnections.length > 0 && (
            <div className="col-md-12 text-center">
              <h3>Connection Requests</h3>
            </div>
          )}
          <div
            className="d-flex justify-space-between row m-2 mt-3 wc_ib-tabs"
            style={{ marginLeft: "2px" }}
          >
            <h5
              className={`col-sm-3 ${
                activeTab === "send" ? "active" : ""
              } mx-0`}
              onClick={() => handleTabChange("send")}
              style={{
                textDecoration: activeTab !== "get " && "none",
                cursor: "pointer",
                width: "50%",
                fontSize: "14px",
              }}
            >
              Connection Requests Send
            </h5>
            <h5
              className={`col-sm-3 ${activeTab === "get" ? "active" : ""} mx-0`}
              onClick={() => handleTabChange("get")}
              style={{
                textDecoration: activeTab !== "send" && "none",
                cursor: "pointer",
                width: "50%",
                fontSize: "14px",
              }}
            >
              Connection Requests Recived
            </h5>
          </div>
          {activeTab === "send" && (
            <ConnectionSend
              sendConnections={sendConnections}
              fetchData={fetchConnections}
            />
          )}
          {activeTab === "get" && (
            <ConnectionRecived
              recivedConnections={recivedConnections}
              fetchData={fetchConnections}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ConnectionNotify;
