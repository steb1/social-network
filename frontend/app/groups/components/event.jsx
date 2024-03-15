import config from "@/config";
import { fetchGroupDetail } from "./groupDetail";

export const Event = ({
  event,
  setPosts,
  setGroup,
  setEvents,
  setRequests,
  setMessages,
  setServerError,
  groupId,
  setIsowner,
  setMembers,
  setInvites,
}) => {
  async function HandleRegisterEvent(
    e,
    setPosts,
    setGroup,
    setEvents,
    setRequest,
    setMessages,
    setServerError,
    groupId,
    option,
    setIsowner,
    setMembers,
    setInvites
  ) {
    let token = document.cookie.split("=")[1];
    if (!e.target.id || !token) {
      return;
    }

    let eventId = e.target.id;

    const formData = new FormData();
    formData.append("eventId", eventId);
    formData.append("option", option);

    if (token) {
      // Use the token as needed
      console.log("Token:", token);
    } else {
      console.log("Token not found in cookies");
    }

    try {
      const response = await fetch(config.serverApiUrl + "registerEvent", {
        method: "POST",
        cache: "no-cache",
        headers: {
          Authorization: token,
        },
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          fetchGroupDetail(
            setPosts,
            setGroup,
            setEvents,
            setRequest,
            setMessages,
            setServerError,
            groupId,
            setIsowner,
            setMembers,
            setInvites
          );
        } else {
          console.error("Response is not in JSON format");
        }
      } else {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.error || "An error occurred.";
        console.error("No Group retrieved:", errorMessage);
      }
    } catch (error) {
      console.error("Error while fetching groups:", error);
    }
  }
  return (
    <div id={event.event_id} className="card w-96 bg-base-100 shadow-xl">
      <figure className=" ">
        <img
          src="https://hire4event.com/blogs/wp-content/uploads/2019/05/Event-Management-Proposal-Hire4event.jpg"
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          Title : {event.title}
          <div className="badge badge-secondary">NEW</div>
        </h2>
        <p> Description : {event.description}</p>
        <p>
          {" "}
          Attendance : {event.attendance > 0
            ? event.attendance
            : "0"} people.{" "}
        </p>
        <div className="card-actions justify-end">
          <div className="badge "> {formatDate(event.event_date)}</div>
        </div>
        <div>
          {event.IsRegistered == 0 ? (
            <div className="badge ">You're Going </div>
          ) : event.IsRegistered == 2 ? (
            <div className="badge text-right"> You not going </div>
          ) : (
            <div className="w-full justify-center flex flex-col gap-3 flex-center ">
              <div className="text-center ">
                Will you participate to this event ?
              </div>
              <div className="flex justify-center flex-row gap-2 flex-center content-center">
                <button
                  id={event.event_id}
                  onClick={(e) =>
                    HandleRegisterEvent(
                      e,
                      setPosts,
                      setGroup,
                      setEvents,
                      setRequests,
                      setMessages,
                      setServerError,
                      groupId,
                      "going",
                      setIsowner,
                      setMembers,
                      setInvites
                    )
                  }
                  className="btn btn-sm w-36    "
                >
                  Yes
                </button>
                <button
                  id={event.event_id}
                  onClick={(e) =>
                    HandleRegisterEvent(
                      e,
                      setPosts,
                      setGroup,
                      setEvents,
                      setRequests,
                      setMessages,
                      setServerError,
                      groupId,
                      "notgoing",
                      setIsowner,
                      setMembers,
                      setInvites
                    )
                  }
                  className="btn btn-sm w-36"
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

async function HandleRegisterEvent(
  e,
  setPosts,
  setGroup,
  setEvents,
  setRequest,
  setMessages,
  setServerError,
  groupId,
  option,
  setIsowner,
  setMembers,
  setInvites
) {
  let token = document.cookie.split("=")[1];
  if (!e.target.id || !token) {
    return;
  }

  let eventId = e.target.id;

  const formData = new FormData();
  formData.append("eventId", eventId);
  formData.append("option", option);

  if (token) {
    // Use the token as needed
    console.log("Token:", token);
  } else {
    console.log("Token not found in cookies");
  }

  try {
    const response = await fetch(config.serverApiUrl + "registerEvent", {
      method: "POST",
      headers: {
        Authorization: token,
      },
      credentials: "include",
      body: formData,
    });

    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        fetchGroupDetail(
          setPosts,
          setGroup,
          setEvents,
          setRequest,
          setMessages,
          setServerError,
          groupId,
          setIsowner,
          setMembers,
          setInvites
        );
      } else {
        console.error("Response is not in JSON format");
      }
    } else {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.error || "An error occurred.";
      console.error("No Group retrieved:", errorMessage);
    }
  } catch (error) {
    console.error("Error while fetching groups:", error);
  }
}

const formatDate = (dateString) => {
  // Parse the date string into a JavaScript Date object
  var parsedDate = new Date(dateString);

  // Define options for formatting
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  // Format the date as a string using the desired format
  var formattedString = parsedDate.toLocaleDateString("fr-FR", options);

  return formattedString;
};
