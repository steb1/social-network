"use server"
import Sidebar from "@/app/components/sidebar";
import Header from "@/app/components/header";
import { GroupDetail } from "../components/groupDetail";

const Group = ( { params }) => {
    return (
    <div className="flex flex-col">
        <div className="">
            <Header/> 
        </div>
        <div className="flex flex-row">
            <div className="mt-10">
                <Sidebar/>
            </div>
            <div className="">
              <GroupDetail params={ params }/>
            </div>
           
        </div>
    </div>
    )}


export default Group