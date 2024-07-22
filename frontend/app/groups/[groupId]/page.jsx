"use server";
import Layout from "../../components/Layout";
import { GroupDetail } from "../components/groupDetail";

const Group = ({ params }) => {
  return (
    <Layout>
      <div className="flex flex-row">
        <div className="">
          <GroupDetail params={params} />
        </div>
      </div>
    </Layout>
  );
};

export default Group;
