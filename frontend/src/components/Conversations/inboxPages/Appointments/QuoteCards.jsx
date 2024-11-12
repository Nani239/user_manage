import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import "./QuoteCards.css"; // Import the CSS file
import QuoteResponces from "./QuoteResponses";
import { useSelector } from "react-redux";
import moment from "moment";

const QuoteCards = ({ allMessages, fetchData }) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;

  return (
    <div className="">
      {allMessages && allMessages.length > 0 ? (
        <div>
          {allMessages.map((msg, index) => (
            <Row
              className="quote-card align-items-center mb-3 p-2"
              key={msg.Id}
            >
              <Col xs="12" md="3">
                <Row>
                  <Col className="mb-3" sm="12" xs="6">
                    <small>
                      <p className="quote-label">Appointment For</p>
                      <b style={{ fontSize: "small" }}>{msg.postName}</b>
                    </small>
                  </Col>
                  <Col sm="12" xs="6">
                    <div className="d-flex" style={{ gap: 30 }}>
                      <small>
                        <p className="quote-label">Date</p>
                        <b style={{ fontSize: "small" }}>
                          {moment(msg.reserveDate).format("MMMM DD, YYYY")}
                        </b>
                      </small>
                      <small>
                        <p className="quote-label">Time</p>
                        <b style={{ fontSize: "small" }}>{msg.startTime}</b>
                      </small>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xs="12" md="2">
                <Row>
                  <Col className="mb-3" sm="12" xs="6">
                    <small>
                      <p className="quote-label">Price</p>
                      <b className="text-primary" style={{ fontSize: "small" }}>
                        ${msg.finalBudget}
                      </b>
                    </small>
                  </Col>
                  <Col sm="12" xs="6">
                    <small>
                      <p className="quote-label">Message</p>
                      <b style={{ fontSize: "small" }}>{msg.Message}</b>
                    </small>
                  </Col>
                </Row>
              </Col>
              <Col xs="12" md="3">
                <div>
                  {msg.Gift ? (
                    <small>
                      <p className="quote-label">
                        {msg.giftAmount ? "Free Gift" : " Free Sample Service"}
                      </p>

                      <p className="text-primary">
                        {msg.giftAmount && <b>${msg.giftAmount}</b>}
                      </p>
                      <b style={{ fontSize: "small" }}>{msg.giftTitle}</b>
                      <p style={{ fontSize: "x-small" }}>
                        {msg.giftDescription}
                      </p>
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </Col>
              <Col xs="12" md="4" className="text-center">
                <QuoteResponces msg={msg} fetchData={fetchData} />
              </Col>
            </Row>
          ))}
        </div>
      ) : (
        <div
          className="position-absolute translate-middle inter-font"
          style={{ left: "60%", top: "40%" }}
        >
          No Quote Requests
        </div>
      )}
    </div>
  );
};

export default QuoteCards;
