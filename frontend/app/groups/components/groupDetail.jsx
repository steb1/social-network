
"use client"

import { useEffect, useState } from "react";
import { GroupCover } from "@/app/components/groupCover";
import { Modal } from "./modal";
import { Event } from "./event";
import { AddEvent } from "./addEvent";
import { Requests } from "./requests";
import { Members } from "./member";
import AddStory from "../../components/addStory";
import { GroupRightBar } from "@/app/groups/components/groupRightBar";
import { PostText } from "./posts"
import config from "@/config";


export async function fetchGroupDetail (setPosts , setGroup, setEvents, setRequests, setMessages, setServerError, groupId, setIsowner, setMembers) {
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
            console.log(data, "")
            setMessages(data.Messages)
            setPosts(data.Post)
            setRequests(data.requests)
            setEvents(data.events)
            setGroup(data.group)
            setIsowner(data.IsOwner)
            setMembers(data.members)
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


export const GroupDetail = ( { params } ) => {

    let [group, setGroup] = useState([])
    let [events, setEvents] = useState([])
    let [posts, setPosts] = useState([])
    let [requests, setRequests] = useState([])
    let [messages, setMessages] = useState([])
    let [tab, setTab] = useState(1)
    let [isowner, setIsowner] = useState(false)
    let [members, setMembers] = useState([])
    let [invites, setInvites] = useState([])
    
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        fetchGroupDetail(setPosts, setGroup, setEvents, setRequests, setMessages, setServerError, params.groupId, setIsowner, setMembers)
    }, [])

    return (
        <div id="site__main"   className="2xl:ml-[--w-side] right-0 w-[1100px]  xl:ml-[--w-side-sm] p-2.5 h-0 mt-0">
         <div id='site__sidebar'
            className='fixed top-0 left-0 z-[99] pt-[--m-top] overflow-hidden transition-transform xl:duration-500 max-xl:w-full max-xl:-translate-x-full'></div>

        <div className="flex flex-col w-full mx-4">
            <div className="mt-36 w-full mr-20" >
            <GroupCover groupInfo={group} setTab={setTab} tab={ tab } isowner={isowner} />
            </div>
            <div className="flex flex-row">
                    
                <div id="content" className=" flex flex-col gap-5 mx-auto ">
                    {tab === 1 && <AddStory />}
                    {tab === 3 && <AddEvent />}
                    
                    <Modal groupId={group.group_id} setPosts={setPosts} setGroup={setGroup} setEvents={setEvents} setRequests={setRequests} setMessages={setMessages} setServerError={setServerError}  setIsOwner={setIsowner} setMembers={setMembers} />
                    {posts && posts.length > 0 && tab == 1 ?(
                                                
                        <PostText  posts={posts} groupId={group.group_id} setPosts={setPosts} setGroup={setGroup} setEvents={setEvents} setRequests={setRequests} setMessages={setMessages} setServerError={setServerError} setIsOwner={setIsowner} setMembers={setMembers}/>
                    ) :  tab == 2 ? (
                        <p> Messages </p>
                    ) : events && events.length > 0 && tab == 3 ? (
                    events.map((event) => (
                    <div className="mx-auto ">
                        <Event key={event.event_id} event={event} setPosts={setPosts} setGroup={setGroup} setEvents={setEvents} setRequests={setRequests} setMessages={setMessages} setServerError={setServerError} groupId={group.group_id} />
                    </div>
                    ))
                    ) : members && members.length > 0 && tab == 4 ? (
                    members.map((member, i) => (
                        <div className="mx-auto pt-5">
                        <Members key={i} member={member} />
                        </div>
                    ))
                    ) : requests && requests.length > 0 && tab == 5 ? (
                    requests.map((request, i) => (
                        <div className="mx-auto pt-5">
            
                            <Requests key={i} request={request} setPosts={setPosts} setGroup={setGroup} setEvents={setEvents} setRequests={setRequests} setMessages={setMessages} setServerError={setServerError} groupId={group.group_id}  setIsowner={setIsowner} setMembers={setMembers} />
                        </div>
                    ))
                    ) : 'Not data avaible.' }
                    
                </div>
                <div className="mt-10 right-0 mb-10 uk-position-fixed" uk-sticky="">
                    <GroupRightBar groupId={group.group_id} invites={invites} setInvites={setInvites} members={members} groupInfo={group} />
                </div>
            </div>
    </div>
  </div>
    )
}

export default {GroupDetail , fetchGroupDetail}