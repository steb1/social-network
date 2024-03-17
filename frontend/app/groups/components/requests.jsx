import config from "@/config";
import { fetchGroupDetail } from "./groupDetail";

export const Requests = ({
  request,
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
  async function handleRequest(e, option, requesterId) {
    console.log("hereeee");
    let token = document.cookie.split("=")[1];
    if (!token) {
      return;
    }
    const formData = new FormData();
    formData.append("requesterId", requesterId);
    formData.append("option", option);
    formData.append("groupId", groupId);

    if (token) {
      // Use the token as needed
      console.log("Token:", token);
    } else {
      console.log("Token not found in cookies");
    }

    try {
      const response = await fetch(config.serverApiUrl + "handleRequestGroup", {
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
            setRequests,
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
    <div className="flex flex-row gap-2">
      <div className="flex flex-row h-16  dark:bg-slate-800 px-1 bg-white gap-3 w-[30rem] border-2 items-center rounded-2xl ">
        <div className="w-9 h-9 rounded-full mr-7">
          <img
            src={
              !request.avatar
                ? "../assets/images/avatars/avatar-5.jpg"
                : request.avatar
            }
            className="rounded-full ml-2"
            alt=""
          />
        </div>
        <div className="w-80 ">
          <p> {request ? request.nickname : ""} </p>
        </div>
        <div className=" flex right-0 gap-2 justify-self-end ">
          <button
            id={request.user_id ? request.user_id : ""}
            onClick={(e) => handleRequest(e, "accept", request.user_id)}
            className="flex flex-row w-16 h-16 px-1 my-auto	 gap-3  items-center rounded-full"
          >
            <img className="" src="../assets/images/group/check.png" />
          </button>
        </div>
      </div>
      <div className="flex flex-row w-10 h-10 px-1 my-auto gap-3  items-center rounded-full">
        <button
          onClick={(e) => handleRequest(e, "reject", request.user_id)}
          className="hover:bg-slate-600"
        >
          <img src="../assets/images/group/delete.png" />
        </button>
      </div>
    </div>
  );
};
