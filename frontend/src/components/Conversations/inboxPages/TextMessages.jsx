import React from "react";
import UnReadMsgs from "./UnReadMsgs";

const TextMessages = ({ textMessages, isLoading, FadeLoader }) => {
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
        <UnReadMsgs allMessages={textMessages} />
      )}
    </div>
  );
};

export default TextMessages;
