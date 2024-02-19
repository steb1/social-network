import React from "react";
import authMiddleware from "@/middleware/authMiddleware";
import config from "@/config";
import MainMessage from "@/app/components/mainMessage";

const Messages = async ({ params: { id } }) => {
    return (
        <>
            <MainMessage />
        </>
    );
};

export default authMiddleware(Messages, config.serverApiUrl + "checkAuth");
