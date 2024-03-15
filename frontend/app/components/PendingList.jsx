"use client";
import React, { useState, useEffect } from "react";
import config from "@/config";

export const PendingList = ({ Persons, cookie }) => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    // Update the local state when the prop changes
    setPersons(Persons);
  }, [Persons]);

  const handleClick = async (index, action) => {
    try {
      const response = await fetch(`${config.serverApiUrl}pendingrequests`, {
        method: "POST",
        cache: "no-cache",
        headers: {
          Authorization: `${cookie}`,
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          type: action === "validate" ? "Accept" : "Reject",
          follower_user_id: persons[index].user_id,
        }),
      });

      if (response.ok) {
        // If the API call is successful, update the state to remove the person
        setPersons((prevPersons) => {
          const updatedPersons = [...prevPersons];
          updatedPersons.splice(index, 1);
          return updatedPersons;
        });
      } else {
        const errorText = await response.text();
        console.error("Requests not changed successfully:", errorText);
      }
    } catch (error) {
      console.error("Error during dealing with pending request:", error);
    }
  };

  return (
    <div className=" mx-auto mt-20 w-auto flex flex-col">
      {persons && persons.length > 0 ? (
        <ul role="list" className=" divide-gray-100">
          {persons.map((person, index) => (
            <li
              key={person.user_id}
              className="flex justify-center mt-2 flex-col  gap-6"
            >
              <div className="flex min-w-0 gap-x-4">
                <img
                  className="h-12 w-12 flex-none rounded-full bg-gray-50"
                  src={`${config.ServerApiImage}${person.avatar}`}
                  alt="Avatar"
                />
                <div className="min-w-0 my-auto flex-auto">
                  <p>
                    {person.first_name} {person.last_name} wants to follow you.
                  </p>
                </div>
                <div className="flex flex-row gap-4">
                  <button
                    onClick={() => handleClick(index, "validate")}
                    className="btn btn-circle bg-slate-300 hover:bg-green-700 btn-xs sm:btn-sm md:btn-md lg:btn-md text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#ffffff"
                        fillRule="evenodd"
                        stroke="fffffff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="4"
                        d="m4 24l5-5l10 10L39 9l5 5l-25 25z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleClick(index, "reject")}
                    className="btn btn-circle bg-slate-300 hover:bg-red-700 btn-xs sm:btn-sm md:btn-md lg:btn-md text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ffffff"
                        d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="my-auto">No new follow requests.</p>
      )}
    </div>
  );
};
