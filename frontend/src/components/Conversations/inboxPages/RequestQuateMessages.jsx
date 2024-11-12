import React from "react";
import RequestAppointments from "./Appointments/RequestAppointments";
import QuoteCards from "./Appointments/QuoteCards";
import { useSelector } from "react-redux";

const RequestQuateMessages = ({ Quotes, fetchData, isLoading, FadeLoader }) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const filteredQuotes = Quotes.filter((quote) => {
    if (quote.ownerId === user?.UserID) {
      return quote.messageStatus !== 0 && quote.messageStatus !== 1;
    } else {
      return true;
    }
  });
  return (
    <div>
      {/* <RequestAppointments allMessages={Quotes} fetchData={fetchData} /> */}
      {isLoading ? (
        <FadeLoader // FadeLoader component
          css={{ margin: "0 auto" }}
          color={"#36D7B7"}
          loading={isLoading}
          className="position-absolute translate-middle"
          style={{ left: "60%", top: "40%" }}
        />
      ) : (
        <QuoteCards allMessages={filteredQuotes} fetchData={fetchData} />
      )}
    </div>
  );
};

export default RequestQuateMessages;
