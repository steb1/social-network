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
import { Event } from "../components/event";
import { AddEvent } from "../components/addEvent";

export async function fetchGroupDetail (setPosts , setGroup, setEvents, setRequests, setMessages, setServerError, groupId) {
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
            setEvents(data.events)
            setGroup(data.group)

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
    let [tab, setTab] = useState(1)

    
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        fetchGroupDetail(setPosts, setGroup, setEvents, setRequest, setMessages, setServerError, params.groupId)
        
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
                <GroupCover groupInfo={group} setTab={setTab} tab={ tab }/>
              </div>
              <div className="flex flex-row">
                      
                  <div id="content" className=" flex flex-col gap-5 mx-auto ">
                        {posts && posts.length > 0 && tab === 1 && <AddStory />}
                        {events && events.length > 0 && tab === 3 && <AddEvent />}
                        
                        <Modal groupId={group.group_id} setPosts={setPosts} setGroup={setGroup} setEvents={setEvents} setRequests={setRequest} setMessages={setMessages} setServerError={setServerError}/>
                        {posts && posts.length > 0 && tab == 1 ?(
                                                  
                          posts.map((post) => (
                            <PostText key={post.PostID} post={post} setPost={setPosts} setGroup={setGroup} setEvents={setEvents} setRequest={setRequest} setMessages={setMessages} setServerError={setServerError} />
                          ))
                        ) :  tab == 2 ? (
                          <p> Messages </p>
                      ) : events && events.length > 0 && tab == 3 ? (
                        events.map((event) => (
                        <div className="mx-auto ">
                          <Event key={event.event_id} event={event} setPosts={setPosts} setGroup={setGroup} setEvents={setEvents} setRequests={setRequest} setMessages={setMessages} setServerError={setServerError} groupId={group.group_id} />
                        </div>
                        ))
                      ) : tab == 4 ? (
                        <p> Members </p>
                      ) : tab == 5 ? (
                        <p> Requests </p>
                      ) : tab == 5 ? (
                        <p> Requests </p>
                      ) : 'Not data avaible.' }
                      
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