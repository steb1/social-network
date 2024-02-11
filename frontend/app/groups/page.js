"use client"
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import { GroupOption } from "../components/groupOption";
import config from "@/config";
import React, { useEffect, useState } from "react";

async function fetchAllGroups (setGroups, setServerError)  {
    let  token = document.cookie.split("=")[1]
      
      if (token) {
        // Use the token as needed
        console.log('Token:', token);
      } else {
        console.log('Token not found in cookies');
      }

      try {
        const response = await fetch(config.serverApiUrl + "getAllGroups", {
          method: "GET",
          headers: {
            'Authorization': token,
          },
          credentials: "include",
        });
      
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            setGroups(data);
          } else {
            console.error("Response is not in JSON format");
            setServerError("Invalid response format");
          }
        } else {
          const errorResponse = await response.json();
          const errorMessage = errorResponse.error || "An error occurred.";
          console.error("No Group retrieved:", errorMessage);
          setServerError(`No Group retrieved: ${errorMessage}`);
        }
      } catch (error) {
        console.error("Error while fetching groups:", error);
      }
}



const Group = () => {

    const [groups, setGroups] = useState([]);
    const [serverError, setServerError] = useState(null);
    
    useEffect(() => {
    fetchAllGroups(setGroups, setServerError);
    }, []);
    
    return (
    <div className="overflow-y-hidden">
         <div>
        <Header/>
         </div>
        <div className=" flex flex-row">
        <div className="mt-16"> 
            <Sidebar/>
        </div>
            <div className="flex flex-col  mt-36">
                <h1 className="text-black text-xl font-bold">Suggestions</h1>
                <hr className="mt-3"/>
                <div className="flex flex-wrap gap-4 flex-row justify-center mt-5">
                {groups.map((group) => (
                    <GroupOption key={group.id} group={group} />
                ))}
                </div>
            </div>
        </div>
    </div>
    )
} 

export default Group