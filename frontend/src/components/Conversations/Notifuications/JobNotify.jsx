import React from "react";
import Sidebar from "../../../SideBar";
import { Col, Row, Button } from "reactstrap";
import { FadeLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import userIcon from "../../../../assets/images/user-icon.png";
import {
  setLoadingNotif,
  setMyJobOffers,
} from "../../../../redux/slices/MsgSlice";
import {
  GetConnections,
  GetJobOffers,
} from "../../../../components/Header/Data3";
import { toast } from "react-toastify";
import axiosClient from "../../../../axios-client";
import { useNavigate } from "react-router-dom";
import SendJobs from "./SendJobs";
import GetJobs from "./GetJobs";

const JobNotify = () => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("send");
  const { loadingNotif, myJobOffers } = useSelector((state) => state.messages);
  const sendJobs = myJobOffers?.filter((job) => job.created_by == user.UserID);
  const recivedJobs = myJobOffers?.filter((job) => job.user_id == user.UserID);

  const fetchJobs = async () => {
    dispatch(setLoadingNotif(true));
    const response = await GetJobOffers(user.UserID);
    dispatch(setMyJobOffers(response));
    dispatch(setLoadingNotif(false));
  };
  React.useEffect(() => {
    fetchJobs();
  }, []);
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
          {myJobOffers && myJobOffers.length > 0 && (
            <div className="col-md-12 text-center">
              <h3 className="my-2">Job Offers</h3>
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
              Job Offers I Send
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
              Job Offers I Received
            </h5>
          </div>

          {activeTab === "send" && (
            <SendJobs sendJobs={sendJobs} fetchJobs={fetchJobs} />
          )}
          {activeTab === "get" && (
            <GetJobs recivedJobs={recivedJobs} fetchJobs={fetchJobs} />
          )}
        </div>
      </div>
    </section>
  );
};

export default JobNotify;
