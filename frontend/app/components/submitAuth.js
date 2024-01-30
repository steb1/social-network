"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const SubmitAuth = ({ targetPath, TODO }) => {
	const router = useRouter();
	const [alreadyOnPage, setAlreadyOnPage] = useState(false);

	useEffect(() => {
		setAlreadyOnPage(router.pathname === targetPath);
	}, [router.pathname, targetPath]);

	if (alreadyOnPage) {
		TODO();
	}

	return;
};

export default SubmitAuth;
