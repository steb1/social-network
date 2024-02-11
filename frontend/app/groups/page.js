"use client"
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import { GroupOption } from "../components/groupOption";
import config from "@/config";
import React, { useEffect, useState } from "react";

export async function fetchAllGroups (setPublicGroups, setOwnGroups, setServerError)  {
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
            setPublicGroups(data.publicGroups);
            setOwnGroups(data.ownGroups)
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

    const [groups, setPublicGroups] = useState([]);
    const [Owngroups, setOwnGroups] = useState([]);

    const [serverError, setServerError] = useState(null);
    
    useEffect(() => {
    fetchAllGroups(setPublicGroups, setOwnGroups, setServerError);
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
        <div className="flex flex-col flew-wrap mb-10">
          <div className="flex flex-col  mt-36">
                <h1 className="text-black text-xl font-bold">Suggestions</h1>
                <hr className="mt-3"/>
                <div className="carousel carousel-center w-[1000px] p-4 space-x-4 bg-neutral rounded-box">
                
                {groups ? (
                  groups.map((group) => (
                    <GroupOption key={group.id} group={group} setGroups={setPublicGroups} setServerError={setServerError} />
                  ))
                ) : (
                  <p>No groups available.</p>
                )}
                </div>
          </div>
          <div className="flex flex-col  mt-36">
              <h1 className="text-black text-xl font-bold">My groups</h1>
              <hr className="mt-3"/>
              <div className="carousel carousel-center w-[1000px] p-4 space-x-4 bg-neutral rounded-box">
              
              {Owngroups ? (
                Owngroups.map((group) => (
                  <div id={group.group_id} className="card card-compact w-96 bg-base-100 shadow-xl carousel-item w-96 h-96">
                      <figure><img src="https://i0.wp.com/www.iedunote.com/img/28051/reference-groups.jpg?fit=1080%2C720&quality=100&ssl=1" alt="Shoes" /></figure>
                      <div className="card-body">
                          <h2 className="card-title">{group.title}</h2>
                          <div className="card-actions justify-end">
                          </div>
                      </div>
                  </div>
                ))
              ) : (
                <p>No groups available.</p>
              )}
              </div>
          </div> 
        </div>
        </div>
    </div>
    )
} 

export default Group