"use client";
import React from "react";
import SideBarPreviewChat from "../messages/SideBarPreviewChat";
import LeftMessage from "../messages/LeftMessage";
import RightMessage from "../messages/RightMessage";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ReactDOM from "react-dom";
import EmojiPicker from "emoji-picker-react";
import TypingIndicator from "../messages/TypingIndicator";
import SideBarPreviewGroupChat from "../messages/SideBarPreviewGroupChat";
import config from "@/config";
import { useWebSocketContext } from "@/public/js/websocketContext";

const MainMessage = ({ AbletoTalk, Chatter, Sender, AvatarSender, Groups, Messages, GroupChatter, MessagesPreview }) => {
	const [messageInput, setMessageInput] = useState("");
	const [messagesPreview, setMessagesPreview] = useState(MessagesPreview);
	const cmsRef = useRef(null);

	const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocketContext();
	// ---------------------------------- INIT SOCKET ----------------------------------------------
	useEffect(() => {
		// Check if a new JSON message has been received
		console.log(lastJsonMessage, "----------------not");
		switch (lastJsonMessage?.command) {
			case "messageforuser":
				console.log("------------message----------", lastJsonMessage);
				if (lastJsonMessage.body.sender !== Chatter[0]?.nickname && lastJsonMessage.body.sender !== Chatter[0]?.email) {
					return;
				}

				cms && ReactDOM.render(ReactDOM.createPortal(<LeftMessage Avatar={Chatter[0].avatar} Content={lastJsonMessage.body.text} Sender={lastJsonMessage.body.sender} Time={Date.now()} />, cms), document.createElement("div"));
				cmsRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
				sendMessageWeb("messagepreview", "");
				break;
			case "messageforgroup":
				const senderInGroup = GroupChatter[0] && GroupChatter[0].Users.find((user) => user.NicknameOrEmail === lastJsonMessage.body.sender);

				if (!senderInGroup) {
					return;
				}

				cms && ReactDOM.render(ReactDOM.createPortal(<LeftMessage Avatar={senderInGroup.Avatar} Content={lastJsonMessage.body.text} Sender={lastJsonMessage.body.sender} Time={Date.now()} />, cms), document.createElement("div"));
				cmsRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
				sendMessageWeb("messagepreview", "");
				break;
			case "typeinprogress":
				if (lastJsonMessage.body.sender !== Chatter[0]?.nickname && lastJsonMessage.body.sender !== Chatter[0]?.email) {
					return;
				}
				RenderType();
				break;
			case "nontypeinprogress":
				if (lastJsonMessage.body.sender !== Chatter[0]?.nickname && lastJsonMessage.body.sender !== Chatter[0]?.email) {
					return;
				}

				if (isRendered) {
					const indicatorElement = document.getElementById("indicator");
					if (indicatorElement) {
						indicatorElement.remove();
						isRendered = false;
					}
				}
				break;
			case "handleGroupRequest":
				console.log("handleGroupRequest");

				break;
			case "inviteUser":
				console.log("inviteUser");
			case "messagepreview":
				console.log("MessagePreview");
				setMessagesPreview(lastJsonMessage.body);
				console.log(lastJsonMessage.body);
			default:
		}
	}, [lastJsonMessage]);
	// ---------------------------------- END SOCKET ----------------------------------------------
	/* You have to init socket and on the initialization you have to set directly what to do on the onMessage state soooo I did, the share options is is I want
		To share that socket between components that why it is set to true.
		https://github.com/robtaussig/react-use-websocket?tab=readme-ov-file#example-implementation
 	 */

	function sendMessageWeb(command, body) {
		const WebSocketMessage = {
			command: command,
			body: body,
		};

		sendJsonMessage(WebSocketMessage);
	}

	const handleSendMessage = async (messageInput, Sender, Chatter, AvatarSender, cmsRef, GroupChatter) => {
		if (messageInput.trim() === "") {
			alert("No empty message");
			return;
		}

		const message = {
			sender: Sender,
			receiver: (Chatter[0] && Chatter[0].nickname) || (Chatter[0] && Chatter[0].email) || (GroupChatter[0] && String(GroupChatter[0].GroupID)),
			text: messageInput,
			time: Date.now(),
		};

		sendMessageWeb("messageforuser", message);
		sendMessageWeb("messagepreview", "");

		// TODO: Handle the response from the server before appending the message if the message succesfully sent to the chatter before append

		const cms = document.getElementById("cms");
		cms && ReactDOM.render(ReactDOM.createPortal(<RightMessage Avatar={AvatarSender} Content={message.text} Sender={"(You)"} Time={Date.now()} />, cms), document.createElement("div"));
		cmsRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
	};
	let isRendered = false;

	const RenderType = () => {
		if (!isRendered) {
			const cms = document.getElementById("cms");
			cms && ReactDOM.render(ReactDOM.createPortal(<TypingIndicator Avatar={Chatter[0].avatar} />, cms), document.createElement("div"));
			cmsRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
			isRendered = true;
		}
	};
	const typeinprogress = async (Sender, Chatter, GroupChatter) => {
		const message = {
			sender: Sender,
			receiver: (Chatter[0] && Chatter[0].nickname) || (Chatter[0] && Chatter[0].email) || (GroupChatter[0] && String(GroupChatter[0].GroupID)),
		};

		sendMessageWeb("typeinprogress", message);
	};

	const nontypeinprogress = async (Sender, Chatter, GroupChatter) => {
		const message = {
			sender: Sender,
			receiver: (Chatter[0] && Chatter[0].nickname) || (Chatter[0] && Chatter[0].email) || (GroupChatter[0] && String(GroupChatter[0].GroupID)),
		};
		sendMessageWeb("nontypeinprogress", message);
	};

	const handleSendMessageClick = () => {
		handleSendMessage(messageInput, Sender, Chatter, AvatarSender, cmsRef, GroupChatter);
		setMessageInput("");
	};

	const handleEmojiClick = (emojiData) => {
		setMessageInput((prevMessage) => prevMessage + emojiData.emoji);
	};

	const debounceNoTyping = debounce(() => nontypeinprogress(Sender, Chatter, GroupChatter), 8000);
	const throttleTyping = throttle(() => typeinprogress(Sender, Chatter, GroupChatter), 3000);

	useEffect(() => {
		cmsRef.current.scrollIntoView({ behavior: "instant", block: "end" });
	}, []);

	return (
		<main id="site__main" className="2xl:ml-[--w-side]  xl:ml-[--w-side-sm] p-2.5 h-[calc(100vh-var(--m-top))] mt-[--m-top]">
			<div className="relative overflow-hidden border -m-2.5 dark:border-slate-700">
				<div className="flex bg-white dark:bg-dark2">
					<div className="md:w-[360px] relative border-r dark:border-slate-700">
						<div id="side-chat" className="top-0 left-0 max-md:fixed max-md:w-5/6 max-md:h-screen bg-white z-50 max-md:shadow max-md:-translate-x-full dark:bg-dark2">
							<div className="p-4 border-b dark:border-slate-700">
								<div className="flex mt-2 items-center justify-between">
									<h1 className="text-2xl font-bold text-black ml-1 dark:text-white"> Chats </h1>
								</div>
							</div>

							<div className="space-y-2 p-2 overflow-y-auto md:h-[calc(100vh-204px)] h-[calc(100vh-130px)]">
								{messagesPreview &&
									messagesPreview.map((user) => {
										if (user.genre === "group") {
											const groupToFetch = Groups.find((group) => group.GroupID == user.nickname);
											const usersInGroup = groupToFetch.Users;
											return <SideBarPreviewGroupChat key={user.nickname} ID={user.userOrGroupID} GroupName={user.name} Users={usersInGroup} Message={user.lastMessage} Time={user.lastInteractionTime} />;
										} else {
											return <SideBarPreviewChat key={user.nickname} PrenomNom={user.name} avatar={user.avatar} To={user.nickname ? user.nickname : user.email} Time={user.lastInteractionTime} Message={user.lastMessage} />;
										}
									})}

								{!AbletoTalk && !Groups && <p className="text-justify font-bold">No chatter available. Follow someone or wait for someone to follow you.</p>}
							</div>
						</div>

						<div id="side-chat" className="bg-slate-100/40 backdrop-blur w-full h-full dark:bg-slate-800/40 z-40 fixed inset-0 max-md:-translate-x-full md:hidden" uk-toggle="target: #side-chat ; cls: max-md:-translate-x-full"></div>
					</div>

					<div className="flex-1">
						{(!Chatter || !Chatter.length) && !Groups ? (
							<>
								<div className="flex items-center justify-between gap-2 w- px-6 py-3.5 z-10 border-b dark:border-slate-700 uk-animation-slide-top-medium">
									<div className="flex items-center sm:gap-4 gap-2">
										<button type="button" className="md:hidden" uk-toggle="target: #side-chat ; cls: max-md:-translate-x-full">
											<ion-icon name="chevron-back-outline" className="text-2xl -ml-4"></ion-icon>
										</button>
									</div>
								</div>

								<div className="w-full p-5 py-10 overflow-y-auto md:h-full h-screen">
									<div className="py-10 text-center text-sm lg:pt-8">
										<div className="mt-3.5">
											<div className="inline-block rounded-lg px-4 py-1.5 text-sm font-semibold">
												<svg xmlns="http://www.w3.org/2000/svg" width="10em" height="10em" viewBox="0 0 24 24">
													<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
														<path d="M8 18.72C6.339 20.134 4.82 21 2 21c1-1 2.27-2.35 2.801-4.447C3.067 15.114 2 13.157 2 11c0-4.418 4.477-8 10-8c5.1 0 9.308 3.054 9.923 7"></path>
														<path fill="currentColor" d="M16 19.889c-3.314 0-6-1.99-6-4.445C10 12.99 12.686 11 16 11s6 1.99 6 4.444c0 1.199-.64 2.286-1.68 3.085c.317 1.165 1.08 1.915 1.68 2.471c-1.8 0-2.716-.544-3.792-1.422c-.684.2-1.428.31-2.208.31z"></path>
													</g>
												</svg>
												<p>Don't be shy chat with someone !</p>
											</div>
										</div>
									</div>
									<div id="cms" ref={cmsRef} className="text-sm font-medium space-y-6 h-[50vh]"></div>
								</div>
							</>
						) : (
							<>
								<div className="flex items-center justify-between gap-2 w- px-6 py-3.5 z-10 border-b dark:border-slate-700 uk-animation-slide-top-medium">
									<div className="flex items-center sm:gap-4 gap-2">
										<button type="button" className="md:hidden" uk-toggle="target: #side-chat ; cls: max-md:-translate-x-full">
											<ion-icon name="chevron-back-outline" className="text-2xl -ml-4"></ion-icon>
										</button>

										<div className="relative cursor-pointer max-md:hidden" uk-toggle="target: .rightt ; cls: hidden">
											<img src={Chatter && Chatter[0] ? `${config.ServerApiImage}${Chatter[0].avatar}` : `${config.ServerApiImage}png-transparent-aquatica-seaworld-orlando-강릉시영상미디어센터-community-group-icon-monochrome-black-noun-project-removebg-preview-removebg-preview.png`} alt="" className="w-8 h-8 rounded-full shadow" />

											<div className="w-2 h-2 bg-teal-500 rounded-full absolute right-0 bottom-0 m-px"></div>
										</div>
										<div className="cursor-pointer" uk-toggle="target: .rightt ; cls: hidden">
											<div className="text-base font-bold"> {Chatter && Chatter[0] ? `${Chatter[0].first_name} ${Chatter[0].last_name}` : GroupChatter && GroupChatter[0] && GroupChatter[0].GroupName}</div>
											<div className="text-xs text-green-500 font-semibold"> Online</div>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<button type="button" className="hover:bg-slate-100 p-1.5 rounded-full" uk-toggle="target: .rightt ; cls: hidden">
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
												<path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
											</svg>
										</button>
									</div>
								</div>

								<div className="w-full p-5 py-10 overflow-y-auto md:h-[calc(100vh-204px)] h-[calc(100vh-195px)]">
									<div className="py-10 text-center text-sm lg:pt-8">
										<img src={Chatter && Chatter[0] ? `${config.ServerApiImage}${Chatter[0].avatar}` : `${config.ServerApiImage}png-transparent-aquatica-seaworld-orlando-강릉시영상미디어센터-community-group-icon-monochrome-black-noun-project-removebg-preview-removebg-preview.png`} className="w-24 h-24 rounded-full mx-auto mb-3" alt="" />
										<div className="mt-8">
											<div className="md:text-xl text-base font-medium text-black dark:text-white"> {Chatter && Chatter.length ? `${Chatter[0].first_name} ${Chatter[0].last_name}` : GroupChatter && GroupChatter[0] && GroupChatter[0].GroupName} </div>
											<div className="text-gray-500 text-sm dark:text-white/80">{Chatter && Chatter[0] ? (Chatter[0].nickname ? "@" + Chatter[0].nickname : Chatter[0].email) : null}</div>
										</div>
										<div className="mt-3.5">
											{Chatter && Chatter[0] && (
												<Link href={`/profile/${Chatter[0].user_id}`} className="inline-block rounded-lg px-4 py-1.5 text-sm font-semibold bg-secondery">
													View profile
												</Link>
											)}
										</div>
									</div>

									<div id="cms" ref={cmsRef} className="text-sm font-medium space-y-6">
										{Chatter && Chatter.length
											? Messages &&
												Object.entries(Messages).map(([date, chatMessages]) => (
													<>
														<div key={date} className="flex justify-center ">
															<div className="font-medium text-gray-500 text-sm dark:text-white/70">{formatDateToLocalDate(date)}</div>
														</div>
														{chatMessages.map((message) => (message.sender == Sender ? <RightMessage Avatar={AvatarSender} Content={message.content} Sender={"(You)"} Time={message.sent_time} key={message.sent_time} /> : <LeftMessage Avatar={Chatter[0].avatar} Content={message.content} Sender={message.sender} Time={message.sent_time} key={message.sent_time} />))}
													</>
												))
											: Messages &&
												Object.entries(Messages).map(([date, chatMessages]) => (
													<>
														<div className="flex justify-center ">
															<div key={date} className="font-medium text-gray-500 text-sm dark:text-white/70">
																{formatDateToLocalDate(date)}
															</div>
														</div>
														{chatMessages.map((message) => (message.sender == Sender ? <RightMessage Avatar={AvatarSender} Content={message.content} Sender={"(You)"} Time={message.sent_time} key={message.sent_time} /> : <LeftMessage Avatar={message.avatar} Content={message.content} Sender={message.sender} Time={message.sent_time} key={message.sent_time} />))}
													</>
												))}
									</div>
								</div>

								<div className="flex items-center md:gap-4 gap-2 md:p-3 p-2 overflow-hidden">
									<div id="message__wrap" className="flex items-center gap-2 h-full dark:text-white -mt-1.5">
										<button type="button" className="shrink-0">
											<ion-icon className="text-3xl flex" name="happy-outline"></ion-icon>
										</button>
										<div className="dropbar p-2" uk-drop="stretch: x; target: #message__wrap ;animation: uk-animation-scale-up uk-transform-origin-bottom-left ;animate-out: true; pos: top-left ; offset:2; mode: click ; duration: 200 ">
											<div className="sm:w-60 bg-white shadow-lg border rounded-xl  pr-0 dark:border-slate-700 dark:bg-dark3">
												<EmojiPicker onEmojiClick={handleEmojiClick} />
											</div>
										</div>
									</div>

									<div className="relative flex-1">
										<textarea
											placeholder="Write your message"
											rows="1"
											value={messageInput}
											onKeyDown={(e) => {
												if (e.key === "Enter" && !e.shiftKey) {
													e.preventDefault(); // Prevents the default behavior of a new line on Enter
													handleSendMessageClick();
												} else {
													throttleTyping();
												}
											}}
											onKeyUp={debounceNoTyping}
											onChange={(e) => setMessageInput(e.target.value)} //  update la valeur du champ de message
											className="w-full resize-none bg-secondery rounded-full px-4 p-2 dark:bg-slate-600"
										></textarea>

										<button type="button" onClick={handleSendMessageClick} className="text-black dark:text-white shrink-0 p-2 absolute right-0.5 top-0">
											<ion-icon className="text-xl flex" name="send-outline"></ion-icon>
										</button>
									</div>
								</div>
							</>
						)}
					</div>

					{(!Chatter || !Chatter.length) && !Groups ? null : (
						<>
							<div className="rightt w-full h-screen absolute top-0 right-0 z-10 hidden transition-transform bg-scroll overflow-y-auto">
								<div className="w-[360px] border-l shadow-lg h-screen bg-white absolute right-0 top-0 uk-animation-slide-right-medium delay-200 z-50 dark:bg-dark2 dark:border-slate-700 bg-scroll overflow-y-auto">
									<div className="w-full h-1.5 bg-gradient-to-r to-purple-500 via-red-500 from-pink-500 -mt-px"></div>
									{Chatter && Chatter[0] && (
										<>
											<div className="py-10 text-center text-sm pt-20">
												<img src={`${config.ServerApiImage}${Chatter[0].avatar}`} className="w-24 h-24 rounded-full mx-auto mb-3" alt="" />
												<div className="mt-8">
													<div className="md:text-xl text-base font-medium text-black dark:text-white"></div>
													<div className="text-gray-500 text-sm mt-1 dark:text-white/80">{Chatter[0].nickname ? "@" + Chatter[0].nickname : Chatter[0].email}</div>
												</div>
												<div className="mt-5">
													<Link href={`/profile/${Chatter[0].user_id}`} className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold bg-secondery">
														View profile
													</Link>
												</div>
											</div>

											<hr className="opacity-80 dark:border-slate-700" />
										</>
									)}
									{GroupChatter &&
										GroupChatter[0] &&
										GroupChatter[0].Users.map((user) => (
											<>
												<div className="py-10 text-center text-sm pt-20">
													<img src={`${config.ServerApiImage}${user.Avatar}`} className="w-24 h-24 rounded-full mx-auto mb-3" alt="" />
													<div className="mt-8">
														<div className="md:text-xl text-base font-medium text-black dark:text-white"></div>
														<div className="text-gray-500 text-sm mt-1 dark:text-white/80">{user.NicknameOrEmail}</div>
													</div>
													<div className="mt-5">
														<Link href={`/profile/${user.ID}`} className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold bg-secondery">
															View profile
														</Link>
													</div>
												</div>
												<hr className="opacity-80 dark:border-slate-700" />
											</>
										))}

									<button type="button" className="absolute top-0 right-0 m-4 p-2 bg-secondery rounded-full" uk-toggle="target: .rightt ; cls: hidden">
										<ion-icon name="close" className="text-2xl flex"></ion-icon>
									</button>
								</div>

								<div className="bg-slate-100/40 backdrop-blur absolute w-full h-full dark:bg-slate-800/40" uk-toggle="target: .rightt ; cls: hidden"></div>
							</div>
						</>
					)}
				</div>
			</div>
		</main>
	);
};

export default MainMessage;

function debounce(fn, delay) {
	let timer = null;
	return function () {
		let context = this;
		let args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function () {
			fn.apply(context, args);
		}, delay);
	};
}

function throttle(fn, delay) {
	let last = 0;
	return function () {
		const now = +new Date();
		if (now - last > delay) {
			fn.apply(this, arguments);
			last = now;
		}
	};
}
function formatDateToLocalDate(date) {
	var parsedDate = new Date(date);

	var options = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};

	var outputDateString = parsedDate.toLocaleDateString("en-US", options);

	return outputDateString;
}
