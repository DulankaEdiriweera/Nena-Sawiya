import React from "react";
import { useParams } from "react-router-dom";
import VCJigsawPlay from "./VCJigsawPlay";

export default function VCJigsawPage() {
  const { puzzleId } = useParams();
  return <VCJigsawPlay puzzleId={puzzleId} />;
}