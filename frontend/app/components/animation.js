"use client";
import dynamic from "next/dynamic";
import React from "react";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Animation = ({ animationData }) => {
	return <Lottie loop animationData={animationData} play="true" />;
};

export default Animation;
