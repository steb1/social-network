"use client"
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import AddStory from "../../components/addStory";
import { GroupRightBar } from "@/app/groups/components/groupRightBar";
import { PostText } from "../components/posts"
import config from "@/config";
import { useEffect, useState } from "react";
import { GroupCover } from "@/app/components/groupCover";
import { Modal } from "../components/modal";

async function fetchGroupDetail (setGroup, setEvents, setPosts, setRequests, setMessages, setServerError, groupId) {
    let  token = document.cookie.split("=")[1]
    try {
        const response = await fetch(config.serverApiUrl + "getGroupDetail", {
          method: "POST",
          headers: {
            'Authorization': token,
          },
          credentials: "include",
          body: JSON.stringify( {groupId : groupId} )
        });
      
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {

            const data = await response.json();
            console.log(data, "-------------- data");
            setMessages(data.Message)
            setPosts(data.Post)
            setRequests(data.request)
            setEvents(data.event)

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


const GroupDetail = ( { params }  ) => {
    let [group, setGroup] = useState([])
    let [events, setEvents] = useState([])
    let [posts, setPosts] = useState([])
    let [request, setRequest] = useState([])
    let [messages, setMessages] = useState([])

    
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        fetchGroupDetail(setGroup, setEvents, setPosts, setRequest, setMessages, setServerError, params.groupId)
    }, [])

    return (
    <div className="flex flex-col">
        <div className="">
            <Header/>
        </div>
        <div className="flex flex-row">
            <div className="mt-10 ">
                <Sidebar/>
            </div>
            <div className="flex flex-col w-full mx-4">
              <div className="mt-36 w-full mr-20">
                <GroupCover groupInfo={group.group}/>
              </div>
              <div className="flex flex-row">
                  <div className=" flex flex-col gap-5 mx-auto ">
                      <AddStory/>
                      <Modal />
                      
                      {posts && posts.length > 0 ? (
                          posts.map((post) => (
                            <PostText key={post.PostID} post={post} setPost={setPosts} setServerError={setServerError} />
                          ))
                        ) : (
                          <p>No Posts available.</p>
                      )}
                  </div>
                  <div className="mt-10 right-0 mb-10">
                    <GroupRightBar/>
                  </div>
              </div>
            </div>
        </div>
    </div>
    )
}

export default GroupDetail