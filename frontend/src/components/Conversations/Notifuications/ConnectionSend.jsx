import React from "react";
import { useSelector } from "react-redux";
import userIcon from "../../../../assets/images/user-icon.png";

const ConnectionSend = ({ sendConnections, fetchData }) => {
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
  console.log(sendConnections, "sendConnections");
  return (
    <div>
      {!loadingNotif && sendConnections && sendConnections.length === 0 && (
        <div
          className="col-md-12 text-center m-5"
          style={{ minHeight: "50vh" }}
        >
          <h3>No Notifications</h3>
        </div>
      )}
      {sendConnections &&
        sendConnections.length > 0 &&
        sendConnections.map((data) => {
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
                    {data.type} | {data.comment}
                  </p>
                </div>

                <div className="d-flex flex-column align-items-end connection-status">
                  <div
                    style={{
                      border: `1px solid ${
                        data.connection_status == 0
                          ? "#ffa900"
                          : data.connection_status == 1
                          ? "green"
                          : "red"
                      }`,
                      color: `${
                        data.connection_status == 0
                          ? "#ffa900"
                          : data.connection_status == 1
                          ? "green"
                          : "red"
                      }`,
                      borderRadius: "5px",
                      padding: "5px",
                      fontWeight: "bold",
                      textAlign: "center",
                      minWidth: "150px",
                      maxWidth: "200px",
                    }}
                  >
                    {data.connection_status == 0
                      ? `${data.type} Request Sent`
                      : data.connection_status == 1
                      ? `Accepted`
                      : data.connection_status == 2
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

export default ConnectionSend;
