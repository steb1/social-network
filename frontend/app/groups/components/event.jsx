export const Event = ( { event, setPosts , setGroup, setEvents, setRequests, setMessages, setServerError} ) => {
    return (
        <div id={event.event_id} className="card w-96 bg-base-100 shadow-xl">
        <figure><img src="https://hire4event.com/blogs/wp-content/uploads/2019/05/Event-Management-Proposal-Hire4event.jpg" alt="Shoes" /></figure>
        <div className="card-body">
            <h2 className="card-title">
            {event.title}
            <div className="badge badge-secondary">NEW</div>
            </h2>
            <p> { event.description }</p>
            <div className="card-actions justify-end">
            <div className="badge left-0"> {formatDate(event.event_date)}</div> 
            
            </div>
        </div>
        </div>
    )


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