/* eslint-disable jsx-a11y/anchor-is-valid */

import React from "react";
import {
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
} from "reactstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import { UpdateReview } from "../../../components/Header/Data2";
import { toast } from "react-toastify";
import "./ReviewCards.css";
import YouTube from "react-youtube";

const ReviewCards = ({ reviews, fetchData }) => {
  const isLogin = useSelector((state) => state.user.isLogin);
  const userInfo = useSelector((state) => state.user.userInfo);
  const user = isLogin ? JSON.parse(userInfo) : null;
  const navigate = useNavigate();

  const handleReviewApprove = async (review) => {
    const request = {
      reviewStatus: 1,
      updatedBy: user?.UserID,
    };
    await UpdateReview(request, review?.Id);
    fetchData();
    toast.success("Rating Approved");
  };

  const handleReviewReject = async (review) => {
    const request = {
      reviewStatus: 2,
      updatedBy: user?.UserID,
    };
    await UpdateReview(request, review?.Id);
    fetchData();
    toast.success("Rating Rejected");
  };

  const getVideoId = (url) => {
    if (!url || typeof url !== "string") return "";
    const lastIndex = url.lastIndexOf("/");
    return lastIndex !== -1 ? url.substring(lastIndex + 1) : "";
  };
  const ViewProfile = (review) => {
    if (review.createdBy !== user.UserID) {
      navigate(`/userDetails/${review.createdBy}`);
    }
  };
  return (
    <div className="p-3">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <Card key={review?.Id} className="mb-4 shadow-sm">
            <CardBody>
              <Row className="align-items-center">
                <Col md={2} className="text-center">
                  <CardImg
                    src={
                      review?.Photo ||
                      "https://st5.depositphotos.com/64247946/66586/v/600/depositphotos_665864664-stock-illustration-default-avatar-profile-picture-user.jpg"
                    }
                    alt="Profile Picture"
                    className="rounded-circle"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                    onClick={() => ViewProfile(review)}
                  />
                  <CardTitle
                    tag="h6"
                    className="mt-2 text-primary"
                    onClick={() => ViewProfile(review)}
                  >
                    <b>{review?.userName}</b>
                  </CardTitle>
                </Col>
                <Col md={6} className="text-center">
                  <CardText className="review-card-text medium-text">
                    {review?.Message}
                  </CardText>
                </Col>
                <Col md={2} className="text-center">
                  <ReactStars
                    count={5}
                    size={24}
                    value={review?.rating}
                    activeColor="#ffd700"
                    edit={false}
                  />
                </Col>
                <Col md={2} className="text-center">
                  {review?.reviewStatus === 0 && (
                    <div>
                      <Button
                        color="success"
                        className="btn-sm w-100 mb-2"
                        onClick={() => handleReviewApprove(review)}
                      >
                        Approve
                      </Button>
                      <Button
                        color="danger"
                        className="btn-sm w-100"
                        onClick={() => handleReviewReject(review)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                  {review?.reviewStatus === 1 && (
                    <Button color="outline-success" className="btn-sm w-100">
                      Active
                    </Button>
                  )}
                  {review?.reviewStatus === 2 && (
                    <Button color="outline-danger" className="btn-sm w-100">
                      Rejected
                    </Button>
                  )}
                </Col>
              </Row>
              {review?.Testimonial && (
                <Row className="mt-3 d-flex justify-content-center">
                  <div className="embed-responsive embed-responsive-16by9 rounded youtube-container">
                    <YouTube
                      videoId={getVideoId(review?.Testimonial)}
                      containerClassName="embed-responsive-item"
                      className="youtube-video"
                      opts={{
                        width: "100%",
                        height: "180",
                        playerVars: {
                          modestbranding: 1,
                          rel: 0,
                        },
                      }}
                    />
                  </div>
                </Row>
              )}
            </CardBody>
          </Card>
        ))
      ) : (
        <div
          className="position-absolute translate-middle inter-font"
          style={{ left: "50%", top: "40%" }}
        >
          No Reviews
        </div>
      )}
    </div>
  );
};

export default ReviewCards;
