import React, { useState, useEffect, Suspense } from "react";
import Sidebar from "../../SideBar";
import { Row, Col } from "reactstrap";
import "../DashboardPages.css";
import "./InboxPage.css";
import { getAllMessages } from "../../../components/Header/Data";
import { useSelector } from "react-redux";
import TextMessages from "./TextMessages";
import RequestQuateMessages from "./RequestQuateMessages";
import OfferMessages from "./VendorOffers/OfferMessages";
import { fetchUserDetails } from "../../../components/Header/Data";
import MyRecordings from "./MyRecordings";
import { Link, useParams } from "react-router-dom";
import { FadeLoader } from "react-spinners"; // Import FadeLoader

const ReviewMessages = React.lazy(() => import("./ReviewMessages"));

const InboxPage = () => {
  const { tab } = useParams(); // Get the active tab from URL
  const defaultTab = tab || "VendorOfferings";
  const islogin = useSelector((state) => state.user.isLogin);
  const userinfo = useSelector((state) => state.user.userInfo);
  const user = islogin ? JSON.parse(userinfo) : null;
  const [textMessages, setTextMessages] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [offers, setOffers] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    if (user.RoleId === 1) {
      const msgForm = {
        roleId: 1,
      };
      const messagesData = await getAllMessages(msgForm);
      const filterParent = messagesData.filter((msg) => msg.parentId === 0);
      const filterText = filterParent.filter((msg) => msg.postType === 1);
      const filterQuote = filterParent.filter((msg) => msg.postType === 2);
      const filterOffers = filterParent.filter((msg) => msg.postType === 3);
      const filterRecordings = filterParent.filter(
        (msg) => msg.playZoomUrl !== null
      );
      setTextMessages(filterText);
      setQuotes(filterQuote);
      setOffers(filterOffers);
      setRecordings(filterRecordings);
      setIsLoading(false);
      window.scroll(0, 0);
    } else {
      setIsLoading(true);
      const msgForm = {
        customerId: user.UserID,
        createdBy: user.UserID,
      };
      const messagesData = await getAllMessages(msgForm);
      const filterParent = messagesData.filter((msg) => msg.parentId === 0);
      const filterText = filterParent.filter((msg) => msg.postType === 1);
      const filterQuote = filterParent.filter((msg) => msg.postType === 2);
      const filterOffers = filterParent.filter((msg) => msg.postType === 3);
      const filterRecordings = filterParent.filter(
        (msg) => msg.playZoomUrl !== null
      );
      setTextMessages(filterText);
      setQuotes(filterQuote);
      setOffers(filterOffers);
      setRecordings(filterRecordings);
      setIsLoading(false);

      window.scroll(0, 0);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTab", defaultTab);
  }, [tab]);

  return (
    <section className="home-after-login bg-white position-relative">
      <div className="container ">
        <Row className="">
          <Col sm={3}>
            <Sidebar />
          </Col>
          <Col sm={9}>
            <div className="inbox-container pt-2">
              <Row className="mb-3 wc_ib-tabs">
                <Col className="p-0">
                  <Link
                    to="/dashboardpage/inbox/VendorOfferings"
                    className="w-100 link-dark"
                  >
                    <h5
                      className={
                        defaultTab === "VendorOfferings" ? "active" : ""
                      }
                    >
                      {user.Role === "provider"
                        ? "Offers from Vendor"
                        : user.Role === "customer"
                        ? "Offers from Vendor"
                        : "Offer Responses"}
                    </h5>
                  </Link>
                </Col>
                <Col className="p-0">
                  <Link
                    to="/dashboardpage/inbox/TextMessages"
                    className="w-100 link-dark text-decoration-none"
                  >
                    <h5
                      className={defaultTab === "TextMessages" ? "active" : ""}
                    >
                      Inbox Messages
                    </h5>
                  </Link>
                </Col>
                <Col className="p-0">
                  <Link
                    to="/dashboardpage/inbox/RequestedQuotes"
                    className="w-100 link-dark"
                  >
                    <h5
                      className={
                        defaultTab === "RequestedQuotes" ? "active" : ""
                      }
                    >
                      {user.Role === "provider"
                        ? "In Person Request from Customers"
                        : user.Role === "customer"
                        ? `In Person Responses From Vendors`
                        : "In Person Responses"}
                    </h5>
                  </Link>
                </Col>
                {user && user.Role === "admin" && (
                  <>
                    <Col className="p-0">
                      <Link
                        to="/dashboardpage/inbox/Review"
                        className="w-100 link-dark"
                      >
                        <h5 className={defaultTab === "Review" ? "active" : ""}>
                          My Reviews
                        </h5>
                      </Link>
                    </Col>

                    <Col className="p-0">
                      <Link
                        to="/dashboardpage/inbox/Recording"
                        className="w-100 link-dark"
                      >
                        <h5 className={tab === "Recording" ? "active" : ""}>
                          My Recordings
                        </h5>
                      </Link>
                    </Col>
                  </>
                )}
              </Row>
              <div className="tab-content">
                {defaultTab === "VendorOfferings" && (
                  <OfferMessages
                    offers={offers}
                    fetchData={fetchData}
                    isLoading={isLoading}
                    FadeLoader={FadeLoader}
                  />
                )}
                {tab === "RequestedQuotes" && (
                  <RequestQuateMessages
                    Quotes={quotes}
                    fetchData={fetchData}
                    isLoading={isLoading}s
                    FadeLoader={FadeLoader}
                  />
                )}
                {tab === "TextMessages" && (
                  <TextMessages
                    textMessages={textMessages}
                    isLoading={isLoading}
                    FadeLoader={FadeLoader}
                  />
                )}
                {tab === "Review" && (
                  <div>
                    <Suspense fallback={<div>Loading...</div>}>
                      <ReviewMessages />
                    </Suspense>
                  </div>
                )}
                {tab === "Recording" && (
                  <MyRecordings
                    rec={recordings}
                    isLoading={isLoading}
                    FadeLoader={FadeLoader}
                  />
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default InboxPage;
