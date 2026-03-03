import React from "react";
import { useParams } from "react-router-dom";
import VCPicComPlay from "./VCPicComPlay";

export default function VCPicComPage() {
  const { activityId } = useParams();
  return <VCPicComPlay activityId={activityId} />;
}