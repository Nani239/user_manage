import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UnReadMsgs from "./UnReadMsgs";
import { getAllMessages } from "../../../components/Header/Data";

const MyRecordings = ({ FadeLoader }) => {
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const [isLoading, setIsLoading] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const filterParents = recordings.filter((rec) => rec.parentId === 0);
  const fetchData = async () => {
    setIsLoading(true);
    if (user.RoleId === 1) {
      const msgForm = {
        Type: "recording",
        roleId: 1,
      };
      const messagesData = await getAllMessages(msgForm);
      const filterParent = messagesData.filter((msg) => msg.parentId === 0);
      const filterRecordings = filterParent.filter(
        (msg) => msg.playZoomUrl !== null
      );
      setRecordings(filterRecordings);
      setIsLoading(false);
      window.scroll(0, 0);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
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
        <UnReadMsgs allMessages={filterParents} />
      )}
    </div>
  );
};

export default MyRecordings;
