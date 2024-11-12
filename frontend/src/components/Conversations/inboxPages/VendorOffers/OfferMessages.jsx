/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import OfferCards from "./OfferCards";

const OfferMessages = ({ offers, fetchData, isLoading, FadeLoader }) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const isAdmin = user && user.Role === "admin";

  const filteredOffers = offers.filter((offer) => {
    if (!isAdmin) {
      return (
        offer.messageStatus !== 0 &&
        offer.messageStatus !== 1 &&
        offer.messageStatus !== 2
      );
    } else {
      return true;
    }
  });

  return (
    <div>
      {isLoading ? (
        <FadeLoader // FadeLoader component
          css={{ margin: "0 auto" }}
          color={"#36D7B7"}
          loading={isLoading}
          className="position-absolute translate-middle"
          style={{ left: "60%", top: "40%" }}
        />
      ) : (
        <OfferCards allMessages={filteredOffers} fetchData={fetchData} />
      )}
    </div>
  );
};

export default OfferMessages;
