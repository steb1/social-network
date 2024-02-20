import React from "react";
import Layout from "../components/Layout";
import { DisplayGroups } from "./components/displayGroups";


const Group = async () => {
    return (
        <Layout>
            <div>
                <DisplayGroups />
            </div>
        </Layout>
    );
};

export default Group;
