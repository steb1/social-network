"use client";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

const SubmitAuth = ({ targetPath, submit }) => {
	const pathname = usePathname();

	const [alreadyOnPage, setAlreadyOnPage] = useState(false);

	useEffect(() => {
		setAlreadyOnPage(pathname === targetPath);
	}, [pathname, targetPath]);

	const handleClick = () => {
		if (alreadyOnPage) {
			submit();
		}
	};

	return (
		<div className="flex items-center justify-center w-full h-full text-center" onClick={handleClick}>
			{getButtonLabel(targetPath)}
		</div>
	);
};

const getButtonLabel = (path) => {
	const trimmedStr = path.replace("/auth/", "");
	const firstPart = trimmedStr.charAt(0).toUpperCase() + trimmedStr.slice(1, 4);
	const secondPart = trimmedStr.charAt(4).toUpperCase() + trimmedStr.slice(5);
	return `${firstPart} ${secondPart}`;
};

export default SubmitAuth;
