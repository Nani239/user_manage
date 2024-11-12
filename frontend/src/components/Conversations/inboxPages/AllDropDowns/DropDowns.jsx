// AllDropdowns.js
import React from "react";
import EventDetails from "./EventDetails";
import FollowUpTasks from "./FollowUpTasks";
import InteractionNotes from "./InteractionNotes";
import OpportunityStage from "./OpportunityStage";
import CallDetails from "./CallDetails";
import Invoices from "./Invoices";
import "./Dropdowns.css";

const AllDropdowns = ({ fetchData }) => {
  return (
    <div className="wc-chat-drops">
      <EventDetails />
      <FollowUpTasks />
      <InteractionNotes />
      <OpportunityStage />
      <CallDetails fetchData={fetchData} />
      <Invoices />
    </div>
  );
};

export default AllDropdowns;
