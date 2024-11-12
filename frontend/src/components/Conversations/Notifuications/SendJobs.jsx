import React from "react";
import { useSelector } from "react-redux";
import userIcon from "../../../../assets/images/user-icon.png";

const SendJobs = ({ sendJobs, fetchJobs }) => {
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

  return (
    <div>
      {!loadingNotif && sendJobs && sendJobs.length === 0 && (
        <div className="col-md-12 text-center mt-5">
          <h3>No Notifications</h3>
        </div>
      )}
      {sendJobs &&
        sendJobs.length > 0 &&
        sendJobs.map((data) => {
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

                <div className="d-flex flex-column align-items-end job-status">
                  <div
                    style={{
                      border: `1px solid ${
                        data.job_status == 0
                          ? "#ffa900"
                          : data.job_status == 1
                          ? "green"
                          : "red"
                      }`,
                      color: `${
                        data.job_status == 0
                          ? "#ffa900"
                          : data.job_status == 1
                          ? "green"
                          : "red"
                      }`,
                      borderRadius: "5px",
                      padding: "5px",
                      fontWeight: "bold",
                      textAlign: "center",
                      width: "100px", // Optional: Set a fixed width for better alignment
                    }}
                  >
                    {data.job_status == 0
                      ? `Job Sent`
                      : data.job_status == 1
                      ? `Accepted`
                      : data.job_status == 2
                      ? `Rejected`
                      : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default SendJobs;
