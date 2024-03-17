"use client";
import { useEffect, useState } from "react";
import Logout from "./Logout";
import config from "@/config";
import Link from "next/link";
import { useWebSocketContext } from "@/public/js/websocketContext";
import { formatDate } from "../messages/SideBarPreviewGroupChat";

export const Element = () => {
    let [notifications, setNotifications] = useState([]);
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocketContext();
    const [messagesPreview, setMessagesPreview] = useState([]);
    const [newMessage, setNewmessage] = useState(false);

    const fetchNotification = async () => {
        let token = document.cookie.split("=")[1];
        if (!token) {
            return;
        }

        try {
            const response = await fetch(config.serverApiUrl + "getNotifications", {
                method: "GET",
                cache: "no-cache",
                headers: {
                    Authorization: token,
                },
                credentials: "include",
            });

            if (response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    setNotifications(data.notifications);
                    setMessagesPreview(data.messagesPreview);
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
    };

    const updateNotif = async (id) => {
        let token = document.cookie.split("=")[1];
        if (!token) {
            return;
        }

        const formData = new FormData();
        formData.append("notifId", id);

        try {
            const response = await fetch(config.serverApiUrl + "updateNotif", {
                method: "POST",
                cache: "no-cache",
                headers: {
                    Authorization: token,
                },
                credentials: "include",
                body: formData,
            });

            if (response.ok) {
                fetchNotification();
            }
        } catch (error) {
            console.error("Error while fetching groups:", error);
        }
    };

    let [numberofnotifs, setNumberofnotifs] = useState(0);

    useEffect(() => {
        fetchNotification();
        // Check if a new JSON message has been received
        switch (lastJsonMessage?.command) {
            case "handleGroupRequest":
                fetchNotification();
                break;
            case "inviteUser":
                fetchNotification();
                break;
            case "eventCreated":
                fetchNotification();
                break;
            case "followPrivate":
                fetchNotification();
                break;
            case "messagePreview":
                fetchNotification();
                break;
            case "messageforuser":
                fetchNotification();
                setNewmessage(true);
                break;
            case "messageforgroup":
                fetchNotification();
                setNewmessage(true);
                break;
        }
    }, [lastJsonMessage]);

    const countElementsWithCondition = (arr, condition) => {
        return arr ? arr?.filter(condition).length : 0;
    };

    numberofnotifs = countElementsWithCondition(notifications, (notification) => !notification.is_read);

    //setNumberofnotifs(numberofnotifs)

    const deleteAllNotif = async () => {
        let token = document.cookie.split("=")[1];
        if (!token) {
            return;
        }

        try {
            const response = await fetch(config.serverApiUrl + "deleteAllNotif", {
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
                    setNotifications(data.notifications);
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
    };

    return (
        <div className='flex-1 relative'>
            <div className='max-w-[1220px] mx-auto flex items-center'>
                <div className='flex items-center sm:gap-4 gap-2 absolute right-5 top-1/2 -translate-y-1/2 text-black'>
                    <button
                        type='button'
                        className='sm:p-2 p-1 rounded-full relative  dark:text-white'
                        uk-tooltip='title: Messages; pos: bottom; offset:6'
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            className='w-7 h-7'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z'
                            />
                        </svg>
                        {newMessage ? (
                            <div className='absolute top-0 right-0 -m-1 bg-red-600 text-white text-xs px-1 rounded-full'></div>
                        ) : (
                            ""
                        )}
                    </button>
                    <div
                        className='hidden bg-white pr-1.5 rounded-lg drop-shadow-xl dark:bg-slate-700 md:w-[360px] w-screen border2'
                        uk-drop='offset:6;pos: bottom-right; mode: click; animate-out: true; animation: uk-animation-scale-up uk-transform-origin-top-right '
                    >
                        {/*heading*/}
                        <div className='flex items-center justify-between gap-2 p-4 pb-1'>
                            <h3 className='font-bold text-xl'> Chats </h3>
                        </div>

                        <div className='h-80 overflow-y-auto pr-2'>
                            {messagesPreview &&
                                messagesPreview.map((user) => (
                                    <div key={user.nickname} className='p-2 pt-0 pr-1 dark:te xt-white/80'>
                                        <Link
                                            href={`/messages/${user.nickname}`}
                                            className='relative flex items-center gap-4 p-2 py-3 duration-200 rounded-lg hover:bg-secondery dark:hover:bg-white/10'
                                        >
                                            <div className='relative w-10 h-10 shrink-0'>
                                                <img
                                                    src={`${config.ServerApiImage}/${user?.avatar}`}
                                                    alt={`Group`}
                                                    className='object-cover w-full h-full rounded-full'
                                                />
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <div className='flex items-center gap-2 mb-1'>
                                                    <div className='mr-auto text-sm text-black dark:text-white font-medium'>
                                                        {user.name}
                                                    </div>
                                                    <div className='text-xs text-gray-500 dark:text-white/80'>
                                                        {" "}
                                                        {formatDate(user.lastInteractionTime)}{" "}
                                                    </div>
                                                    <div className='w-2.5 h-2.5 bg-blue-600 rounded-full dark:bg-slate-700'></div>
                                                </div>
                                                <div className='font-normal overflow-hidden text-ellipsis text-xs whitespace-nowrap'>
                                                    {user.lastMessage === "" ? "No message yet." : user.lastMessage}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                        </div>

                        {/*footer*/}
                        <a href='#'>
                            <div class='text-center py-4 border-t border-slate-100 text-sm font-medium text-blue-600 dark:text-white dark:border-gray-600'>
                                {" "}
                                See all Messages{" "}
                            </div>
                        </a>
                        <div class='w-3 h-3 absolute -top-1.5 right-3 bg-white border-l border-t rotate-45 max-md:hidden dark:bg-dark3 dark:border-transparent'></div>
                    </div>
                    {/*notification*/}
                    <button
                        type='button'
                        className='sm:p-2 p-1 rounded-full relative dark:text-white'
                        uk-tooltip='title: Notification; pos: bottom; offset:6'
                        onClick={fetchNotification}
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            className='w-7 h-7'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5'
                            />
                        </svg>
                        <div className='absolute top-0 right-0 -m-1 bg-red-600 text-white text-xs px-1 rounded-full'>
                            {countElementsWithCondition(notifications, (notification) => !notification.is_read)}
                        </div>
                    </button>
                    <div
                        className='hidden bg-white pr-1.5 rounded-lg drop-shadow-xl dark:bg-slate-700 md:w-[365px] w-screen border2'
                        uk-drop='offset:6;pos: bottom-right; mode: click; animate-out: true; animation: uk-animation-scale-up uk-transform-origin-top-right '
                    >
                        {/*heading*/}
                        <div className='flex items-center justify-between gap-2 p-4 pb-2'>
                            <h3 className='font-bold text-xl'> Notifications </h3>
                            <div classname=' flex right-0 gap-2 justify-self-end '>
                                <button
                                    onClick={deleteAllNotif}
                                    className=' w-16 h-16 px-1 text-slate-700	dark:text-white'
                                >
                                    🚮 Vider
                                </button>
                            </div>
                        </div>
                        <div className='text-sm h-[400px] w-full overflow-y-auto pr-2'>
                            {/*contents list*/}
                            <div className='pl-2 p-1 text-sm font-normal dark:text-white'>
                                {notifications && Array.isArray(notifications)
                                    ? notifications.map((notification) => (
                                          <Link
                                              key={notification.notification_id}
                                              href={
                                                  notification.notification_type === "inviteUser"
                                                      ? "/groups"
                                                      : notification.notification_type === "requestGroup"
                                                        ? `/groups/${notification.Group?.group_id}`
                                                        : notification.notification_type === "followPrivate"
                                                          ? `/followRequests`
                                                          : ""
                                              }
                                              className='relative flex items-center gap-3 p-2 duration-200 rounded-xl pr-10 hover:bg-secondery dark:hover:bg-white/10 bg-teal-500/5 mb-5'
                                              onClick={() => updateNotif(notification.notification_id)}
                                          >
                                              <div className='relative w-12 h-12 shrink-0'>
                                                  {" "}
                                                  <img
                                                      src='assets/images/avatars/avatar-3.jpg'
                                                      alt=''
                                                      className='object-cover w-full h-full rounded-full'
                                                  />
                                              </div>
                                              <div className='flex-1 '>
                                                  <p>
                                                      {" "}
                                                      <b className='font-bold mr-1'>
                                                          {" "}
                                                          {notification.Sender.first_name}{" "}
                                                      </b>{" "}
                                                      {notification.notification_type === "inviteUser"
                                                          ? `invited you to join the group `
                                                          : notification.notification_type === "requestGroup"
                                                            ? `requests to join the group `
                                                            : notification.notification_type === "followPrivate"
                                                              ? `wants to follow your private account.`
                                                              : ""}
                                                      {notification.Group?.title ? (
                                                          <>
                                                              <b className='font-bold mr-1'>
                                                                  {" "}
                                                                  {notification.Group.title}{" "}
                                                              </b>
                                                          </>
                                                      ) : (
                                                          ""
                                                      )}
                                                  </p>

                                                  <div className='text-xs text-gray-500 mt-1.5 dark:text-white/80'>
                                                      {" "}
                                                      {notification.created_at}
                                                  </div>
                                                  {!notification.is_read ? (
                                                      <div className='w-2.5 h-2.5 bg-teal-600 rounded-full absolute right-3 top-5'></div>
                                                  ) : (
                                                      ""
                                                  )}
                                              </div>
                                          </Link>
                                      ))
                                    : ""}
                            </div>
                        </div>
                        {/*footer*/}
                        <a href='#'>
                            <div className='text-center py-4 border-t border-slate-100 text-sm font-medium text-blue-600 dark:text-white dark:border-gray-600'>
                                {" "}
                                View Notifications{" "}
                            </div>
                        </a>
                        <div className='w-3 h-3 absolute -top-1.5 right-3 bg-white border-l border-t rotate-45 max-md:hidden dark:bg-dark3 dark:border-transparent'></div>
                    </div>
                    <Logout />
                </div>
            </div>
        </div>
    );
};
