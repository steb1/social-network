"use client";
import { useState, useEffect } from "react";
import config from "@/config";
import { GroupOption } from "@/app/components/groupOption";
import { GroupInvited } from "./invitedgroups";

export async function fetchAllGroups(
  setPublicGroups,
  setOwnGroups,
  setServerError,
  setSubcribedGroups,
  setInvitedgroups
) {
  let token = document.cookie.split("=")[1];

  if (token) {
    // Use the token as needed
    console.log("Token:", token);
  } else {
    console.log("Token not found in cookies");
  }

  try {
    const response = await fetch(config.serverApiUrl + "getAllGroups", {
      method: "GET",
      headers: {
        Authorization: token,
      },
      credentials: "include",
    });

    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setPublicGroups(data.publicGroups);
        setOwnGroups(data.ownGroups);
        setSubcribedGroups(data.subcribedGroups);
        setInvitedgroups(data.InvitedGroups);
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

export const DisplayGroups = () => {
  const [groups, setPublicGroups] = useState([]);
  const [Owngroups, setOwnGroups] = useState([]);
  const [subcribedGroups, setSubcribedGroups] = useState([]);
  const [invitedgroups, setInvitedgroups] = useState([]);

  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    fetchAllGroups(
      setPublicGroups,
      setOwnGroups,
      setServerError,
      setSubcribedGroups,
      setInvitedgroups
    );
  }, []);

  return (
    <main
      id="site__main"
      className="2xl:ml-[--w-side]  xl:ml-[--w-side-sm] p-2.5 h-0 mt-0 mb-11"
    >
      <div className="max-w-[1065px] dark:bg-slate-800 mx-auto max-lg:-m-2.5">
        <div className="flex flex-col mt-20">
          <h1 className="text-black text-xl font-bold">Suggestions</h1>
          <hr className="mt-3" />
          <div className="carousel carousel-center w-auto p-4 space-x-4 bg-neutral rounded-box">
            {groups ? (
              groups.map((group) => (
                <GroupOption
                  key={group.id}
                  group={group}
                  setGroups={setPublicGroups}
                  setServerError={setServerError}
                />
              ))
            ) : (
              <p>No groups available.</p>
            )}
          </div>
        </div>
        <div className="flex flex-col mt-10">
          <h1 className="text-black text-xl font-bold">My groups</h1>
          <hr className="mt-3" />
          <div className="carousel carousel-center w-auto p-4 space-x-4 bg-neutral rounded-box">
            {Owngroups ? (
              Owngroups.map((group) => (
                <a href={"/groups/" + group.group_id}>
                  <div
                    id={group.group_id}
                    className="card card-compact w-96 bg-base-100 shadow-xl carousel-item w-96 h-64"
                  >
                    <figure>
                      <img
                        src="https://i0.wp.com/www.iedunote.com/img/28051/reference-groups.jpg?fit=1080%2C720&quality=100&ssl=1"
                        alt="Shoes"
                      />
                    </figure>
                    <div className="card-body">
                      <h2 className="card-title">{group.title}</h2>
                      <div className="card-actions justify-end"></div>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <p>No groups available.</p>
            )}
          </div>
        </div>
        <div className="flex flex-col mt-10">
          <h1 className="text-black text-xl font-bold">Invited Groups</h1>
          <hr className="mt-3" />
          <div className="carousel carousel-center w-auto p-4 overflow-y-scroll space-x-4 bg-neutral rounded-box">
            {invitedgroups ? (
              invitedgroups.map((group) => (
                <GroupInvited
                  key={group.id}
                  group={group}
                  setPublicGroups={setPublicGroups}
                  setOwnGroups={setOwnGroups}
                  setServerError={serverError}
                  setSubcribedGroups={setSubcribedGroups}
                  setInvitedgroups = {setInvitedgroups}
                 
                />
              ))
            ) : (
              <p>No groups available.</p>
            )}
          </div>
        </div>
        <div className="flex flex-col mt-10">
          <h1 className="text-black text-xl font-bold">Subcribed Groups</h1>
          <hr className="mt-3" />
          <div className="carousel carousel-center w-auto p-4 space-x-4 bg-neutral rounded-box">
            {subcribedGroups ? (
              subcribedGroups.map((group) => (
                <a href={"/groups/" + group.group_id}>
                  <div
                    id={group.group_id}
                    className="card card-compact w-96 bg-base-100 shadow-xl carousel-item w-96 h-64"
                  >
                    <figure>
                      <img
                        src="https://i0.wp.com/www.iedunote.com/img/28051/reference-groups.jpg?fit=1080%2C720&quality=100&ssl=1"
                        alt="Shoes"
                      />
                    </figure>
                    <div className="card-body">
                      <h2 className="card-title">{group.title}</h2>
                      <div className="card-actions justify-end"></div>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <p>No groups available.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
