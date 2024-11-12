import React, { useEffect, useState } from "react";
import ReviewCards from "./ReviewCards";
import { getAllReviews } from "../../../components/Header/Data";
import { useDispatch } from "react-redux";
import { FadeLoader } from "react-spinners"; // Import FadeLoader

const ReviewMessages = () => {
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    const allReviews = await getAllReviews();
    // const filterReviews = allReviews.filter(
    //   (review) => review.reviewStatus !== 2
    // );
    // console.log(filterReviews, "filterReviews");
    setReviews(allReviews);
    setIsLoading(false);
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
        <ReviewCards reviews={reviews} fetchData={fetchData} />
      )}
    </div>
  );
};

export default ReviewMessages;
