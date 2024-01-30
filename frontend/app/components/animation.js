"use client";
import React from "react";
import Lottie from "lottie-react";

const Animation = ({ animationData }) => {
  return <Lottie loop animationData={animationData} play />;
};

export default Animation;
