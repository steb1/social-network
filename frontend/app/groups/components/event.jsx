import config from "@/config";
import { fetchGroupDetail } from "../[groupId]/page";

export const Event = ( { event, setPosts , setGroup, setEvents, setRequests, setMessages, setServerError, groupId} ) => {
    return (
        <div id={event.event_id} className="card w-96 bg-base-100 shadow-xl">
        <figure className=" "><img src="https://hire4event.com/blogs/wp-content/uploads/2019/05/Event-Management-Proposal-Hire4event.jpg" alt="Shoes" /></figure>
        <div className="card-body">
            <h2 className="card-title">
            {event.title}
            <div className="badge badge-secondary">NEW</div>
            </h2>
            <p> { event.description }</p>
            <p> Attendance : { event.attendance > 0 ? event.attendance : "0" } people. </p>
            <div className="card-actions justify-end">
            <div className="badge left-0"> {formatDate(event.event_date)}</div> 
            </div>
            { event.IsRegistered == 0 ? "Registered" : event.IsRegistered == 2 ? "You not going" : <button id={event.event_id} onClick={ (e) => HandleRegisterEvent( e, setPosts, setGroup, setEvents, setRequests, setMessages, setServerError, groupId ) } className="btn btn-sm"> Register </button> }
        </div>
        </div>
    )
}

async function HandleRegisterEvent  ( e, setPosts, setGroup, setEvents, setRequests, setMessages, setServerError, groupId ) {
    let  token = document.cookie.split("=")[1]
    if (!e.target.id || !token) {
        return
    }

    let eventId = e.target.id
    
    const formData = new FormData();
    formData.append("eventId", eventId);

    if (token) {
        // Use the token as needed
        console.log('Token:', token);
      } else {
        console.log('Token not found in cookies');
      }

      try {
        const response = await fetch(config.serverApiUrl + "registerEvent", {
          method: "POST",
          headers: {
            'Authorization': token,
          },
          credentials: "include",
          body: formData,
        });
      
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            fetchGroupDetail(setPosts, setGroup, setEvents, setRequests, setMessages, setServerError, groupId)
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

return formattedString
}