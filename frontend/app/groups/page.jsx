import React from "react";
import Layout from "../components/Layout";
import { DisplayGroups } from "./components/displayGroups";
import AuthMiddleware from "@/middleware/authMiddleware";
import config from "@/config";

const Group = async () => {
	return (
		<Layout>
			<DisplayGroups />
		</Layout>
	);
};

export default AuthMiddleware(Group, config.serverApiUrl + "checkAuth");
