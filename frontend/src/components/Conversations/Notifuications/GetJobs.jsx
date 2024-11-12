import React from "react";
import { useSelector } from "react-redux";
import userIcon from "../../../../assets/images/user-icon.png";
import { Button } from "reactstrap";
import { toast } from "react-toastify";
import axiosClient from "../../../../axios-client";

const GetJobs = ({ recivedJobs, fetchJobs }) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const { loadingNotif } = useSelector((state) => state.messages);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const handleAccept = async (e, data) => {
    e.stopPropagation();
    const req = {
      jobStatus: 1,
      updatedBy: user.UserID,
    };
    try {
      const response = await axiosClient.put(
        `message/StatusUpdateJob/${data.id}`,
        req
      );
      if (response.status === 200) {
        toast.success("Job Offer Accepted");
        fetchJobs();
      }
    } catch (error) {
      toast.error("Failed Accepting Job Offer");
    }
  };
  const handleIgnore = async (e, data) => {
    e.stopPropagation();
    const req = {
      jobStatus: 2,
      updatedBy: user.UserID,
    };
    try {
      const response = await axiosClient.put(
        `message/StatusUpdateJob/${data.id}`,
        req
      );
      if (response.status === 200) {
        // toast.success("Connection Ignored");
        fetchJobs();
      }
    } catch (error) {
      toast.error("Failed Ignoring Connection");
    }
  };
  const renderJobStatus = (status, data) => {
    if (status == 0) {
      return (
        <div className="d-flex flex-column align-items-end">
          <Button
            color="danger"
            size="sm"
            outline
            className="mb-2"
            onClick={(e) => handleIgnore(e, data)}
          >
            Ignore
          </Button>
          <Button
            color="primary"
            size="sm"
            onClick={(e) => handleAccept(e, data)}
          >
            Accept
          </Button>
        </div>
      );
    } else {
      const statusLabel = status == 1 ? "Accepted" : "Ignored";
      const statusColor = status == 1 ? "green" : "red";
      return (
        <div
          className="d-flex flex-column job-status"
          style={{
            border: `1px solid ${statusColor}`,
            color: statusColor,
            borderRadius: "5px",
            padding: "5px",
            fontWeight: "bold",
            textAlign: "center",
            width: "100px",
          }}
        >
          {statusLabel}
        </div>
      );
    }
  };
  return (
    <div>
      {!loadingNotif && recivedJobs && recivedJobs.length === 0 && (
        <div className="col-md-12 text-center mt-5">
          <h3>No Notifications</h3>
        </div>
      )}
      {recivedJobs &&
        recivedJobs.length > 0 &&
        recivedJobs.map((data) => {
          return (
            <div className="col-md-12 mb-3">
              <div
                className="card d-flex flex-row align-items-center p-3"
                style={{
                  border: "1px solid #36D7B7",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  color: "white",
                }}
              >
                <img
                  src={userIcon} // replace with appropriate data field
                  alt={`${data.user_first_name}'s profile`}
                  className="rounded-circle"
                  style={{
                    width: "80px",
                    height: "80px",
                    marginRight: "15px",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h5 className="card-title mb-1">
                    {data.created_by == user.UserID
                      ? data.user_first_name
                      : data.creator_first_name}
                  </h5>
                  <p className="text-muted mb-1" style={{ fontSize: "0.85em" }}>
                    {data.job_role} | {data.salary} | {data.joining_period}
                  </p>
                  <p className="card-text">{data.job_description}</p>
                </div>

                {renderJobStatus(data.job_status, data)}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default GetJobs;
