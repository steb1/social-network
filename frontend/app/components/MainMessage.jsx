"use client";
import React from "react";
import SideBarPreviewChat from "../messages/SideBarPreviewChat";
import LeftMessage from "../messages/LeftMessage";
import RightMessage from "../messages/RightMessage";
import DateMessage from "../messages/DateMessage";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Animation from "@/app/components/animation.js";
import authAnimation from "@/public/assets/animations/authAnimation.json";
import socket from "@/public/js/socket";
import ReactDOM from "react-dom";
import EmojiPicker, { EmojiClickData, SkinTones, EmojiStyle } from "emoji-picker-react";
import TypingIndicator from "../messages/TypingIndicator";
import SideBarPreviewGroupChat from "../messages/SideBarPreviewGroupChat";

const MainMessage = ({ AbletoTalk, Chatter, Sender, AvatarSender }) => {
	const [messageInput, setMessageInput] = useState("");
	const cmsRef = useRef();
	let isRendered = false;

	const RenderType = () => {
		if (!isRendered) {
			const cms = document.getElementById("cms");
			cms && ReactDOM.render(ReactDOM.createPortal(<TypingIndicator Avatar={Chatter[0].avatar} />, cms), document.createElement("div"));
			cmsRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
			isRendered = true;
		}
	};

	useEffect(() => {
		socket.onopen = function () {
			// console.log("Ws Open");
		};

		socket.onmessage = async function (event) {
			const message = JSON.parse(event.data);
			const cms = document.getElementById("cms");
			switch (message.command) {
				case "messageforuser":
					if (message.body.sender !== Chatter[0].nickname && message.body.sender !== Chatter[0].email) {
						return;
					}

					cms && ReactDOM.render(ReactDOM.createPortal(<LeftMessage Avatar={Chatter[0].avatar} Content={message.body.text} />, cms), document.createElement("div"));
					cmsRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
					break;
				case "typeinprogress":
					if (message.body.sender !== Chatter[0].nickname && message.body.sender !== Chatter[0].email) {
						return;
					}
					RenderType();
					break;
				case "nontypeinprogress":
					if (message.body.sender !== Chatter[0].nickname && message.body.sender !== Chatter[0].email) {
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

				default:
			}
		};
	}, []);

	const handleSendMessageClick = () => {
		handleSendMessage(messageInput, Sender, Chatter, AvatarSender, cmsRef);
		setMessageInput("");
	};

	const handleEmojiClick = (emojiData) => {
		setMessageInput((prevMessage) => prevMessage + emojiData.emoji);
	};

	const debounceNoTyping = debounce(() => nontypeinprogress(Sender, Chatter), 8000);
	const throttleTyping = throttle(() => typeinprogress(Sender, Chatter), 3000);

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
								{AbletoTalk ? AbletoTalk.map((user) => <SideBarPreviewChat key={user.user_id} PrenomNom={`${user.first_name} ${user.last_name}`} avatar={user.avatar} To={user.nickname ? user.nickname : user.email} />) : <p className="text-justify font-bold">No chatter avalaible follows someone or wait someone to follow you</p>}
								<SideBarPreviewGroupChat />
							</div>
						</div>

						<div id="side-chat" className="bg-slate-100/40 backdrop-blur w-full h-full dark:bg-slate-800/40 z-40 fixed inset-0 max-md:-translate-x-full md:hidden" uk-toggle="target: #side-chat ; cls: max-md:-translate-x-full"></div>
					</div>

					<div className="flex-1">
						{!Chatter || !Chatter.length ? (
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
												<p>Don't be shy chat someone !</p>
											</div>
										</div>
									</div>
									<div id="cms" className="text-sm font-medium space-y-6 h-[50vh]"></div>
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
											<img src={`http://localhost:8080/img/${Chatter[0].avatar}`} alt="" className="w-8 h-8 rounded-full shadow" />
											<div className="w-2 h-2 bg-teal-500 rounded-full absolute right-0 bottom-0 m-px"></div>
										</div>
										<div className="cursor-pointer" uk-toggle="target: .rightt ; cls: hidden">
											<div className="text-base font-bold">{`${Chatter[0].first_name} ${Chatter[0].last_name}`}</div>
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
										<img src={`http://localhost:8080/img/${Chatter[0].avatar}`} className="w-24 h-24 rounded-full mx-auto mb-3" alt="" />
										<div className="mt-8">
											<div className="md:text-xl text-base font-medium text-black dark:text-white"> {`${Chatter[0].first_name} ${Chatter[0].last_name}`}</div>
											<div className="text-gray-500 text-sm   dark:text-white/80"> {Chatter[0].nickname ? "@" + Chatter[0].nickname : Chatter[0].email}</div>
										</div>
										<div className="mt-3.5">
											<Link href={`/profile/${Chatter[0].user_id}`} className="inline-block rounded-lg px-4 py-1.5 text-sm font-semibold bg-secondery">
												View profile
											</Link>
										</div>
									</div>

									<div id="cms" ref={cmsRef} className="text-sm font-medium space-y-6">
										{/* //TODO RANGE LES Messages */}
										{/* TU range puis tu appeles le component date  */}
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
											onKeyDown={throttleTyping}
											onKeyUp={debounceNoTyping}
											onChange={(e) => setMessageInput(e.target.value)} //  update la valeur du champ de message
											className="w-full resize-none bg-secondery rounded-full px-4 p-2"
										></textarea>

										<button type="button" onClick={handleSendMessageClick} className="text-black dark:text-white shrink-0 p-2 absolute right-0.5 top-0">
											<ion-icon className="text-xl flex" name="send-outline"></ion-icon>
										</button>
									</div>
								</div>
							</>
						)}
					</div>

					{!Chatter || !Chatter.length ? null : (
						<>
							<div className="rightt w-full h-full absolute top-0 right-0 z-10 hidden transition-transform">
								<div className="w-[360px] border-l shadow-lg h-screen bg-white absolute right-0 top-0 uk-animation-slide-right-medium delay-200 z-50 dark:bg-dark2 dark:border-slate-700">
									<div className="w-full h-1.5 bg-gradient-to-r to-purple-500 via-red-500 from-pink-500 -mt-px"></div>

									<div className="py-10 text-center text-sm pt-20">
										<img src={`http://localhost:8080/img/${Chatter[0].avatar}`} className="w-24 h-24 rounded-full mx-auto mb-3" alt="" />
										<div className="mt-8">
											<div className="md:text-xl text-base font-medium text-black dark:text-white"> {`${Chatter[0].first_name} ${Chatter[0].last_name}`} </div>
											<div className="text-gray-500 text-sm mt-1 dark:text-white/80">{Chatter[0].nickname ? "@" + Chatter[0].nickname : Chatter[0].email}</div>
										</div>
										<div className="mt-5">
											<Link href={`/profile/${Chatter[0].user_id}`} className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold bg-secondery">
												View profile
											</Link>
										</div>
									</div>

									<hr className="opacity-80 dark:border-slate-700" />

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

const handleSendMessage = async (messageInput, Sender, Chatter, AvatarSender, cmsRef) => {
	if (messageInput.trim() === "") {
		alert("No empty message");
		return;
	}

	const message = {
		sender: Sender,
		receiver: Chatter[0].nickname || Chatter[0].email,
		text: messageInput,
		time: Date.now(),
	};

	await sendMessage(socket, "messageforuser", message);

	// TODO: Handle the response from the server before appending the message if the message succesfully sent to the chatter before append

	const cms = document.getElementById("cms");
	cms && ReactDOM.render(ReactDOM.createPortal(<RightMessage Avatar={AvatarSender} Content={message.text} />, cms), document.createElement("div"));
	cmsRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
};

export async function sendMessage(socket, command, body) {
	const WebSocketMessage = {
		command: command,
		body: body,
	};

	socket.send(JSON.stringify(WebSocketMessage));
}

const typeinprogress = async (Sender, Chatter) => {
	const message = {
		sender: Sender,
		receiver: Chatter[0].nickname || Chatter[0].email,
	};
	sendMessage(socket, "typeinprogress", message);
};

const nontypeinprogress = async (Sender, Chatter) => {
	const message = {
		sender: Sender,
		receiver: Chatter[0].nickname || Chatter[0].email,
	};
	sendMessage(socket, "nontypeinprogress", message);
};

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
