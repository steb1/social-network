import React from "react";
import authMiddleware from "@/middleware/authMiddleware";
import config from "@/config";
import MainMessage from "@/app/components/mainMessage";
import Layout from "../components/Layout";

const Messages = async ({ params: { id } }) => {
    return (
        <Layout>
            <MainMessage />
        </Layout>
    );
};

export default authMiddleware(Messages, config.serverApiUrl + "checkAuth");
