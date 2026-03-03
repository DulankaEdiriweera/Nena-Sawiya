import React from "react";
import { useParams } from "react-router-dom";
import VCShaMatPlay from "./VCShaMatPlay";

export default function VCShaMatPage() {
  const { activityId } = useParams();
  return <VCShaMatPlay activityId={activityId} />;
}