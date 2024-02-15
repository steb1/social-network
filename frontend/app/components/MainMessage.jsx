import React from "react";
import SideBarPreviewChat from "../messages/SideBarPreviewChat";
import LeftMessage from "../messages/LeftMessage";
import RightMessage from "../messages/RightMessage";
import DateMessage from "../messages/DateMessage";

const MainMessage = () => {
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
								<SideBarPreviewChat />
								<SideBarPreviewChat />
							</div>
						</div>

						<div id="side-chat" className="bg-slate-100/40 backdrop-blur w-full h-full dark:bg-slate-800/40 z-40 fixed inset-0 max-md:-translate-x-full md:hidden" uk-toggle="target: #side-chat ; cls: max-md:-translate-x-full"></div>
					</div>

					<div className="flex-1">
						<div className="flex items-center justify-between gap-2 w- px-6 py-3.5 z-10 border-b dark:border-slate-700 uk-animation-slide-top-medium">
							<div className="flex items-center sm:gap-4 gap-2">
								<button type="button" className="md:hidden" uk-toggle="target: #side-chat ; cls: max-md:-translate-x-full">
									<ion-icon name="chevron-back-outline" className="text-2xl -ml-4"></ion-icon>
								</button>

								<div className="relative cursor-pointer max-md:hidden" uk-toggle="target: .rightt ; cls: hidden">
									<img src="assets/images/avatars/avatar-6.jpg" alt="" className="w-8 h-8 rounded-full shadow" />
									<div className="w-2 h-2 bg-teal-500 rounded-full absolute right-0 bottom-0 m-px"></div>
								</div>
								<div className="cursor-pointer" uk-toggle="target: .rightt ; cls: hidden">
									<div className="text-base font-bold"> Monroe Parker</div>
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
								<img src="assets/images/avatars/avatar-6.jpg" className="w-24 h-24 rounded-full mx-auto mb-3" alt="" />
								<div className="mt-8">
									<div className="md:text-xl text-base font-medium text-black dark:text-white"> Monroe Parker </div>
									<div className="text-gray-500 text-sm   dark:text-white/80"> @Monroepark </div>
								</div>
								<div className="mt-3.5">
									<a href="timeline.html" className="inline-block rounded-lg px-4 py-1.5 text-sm font-semibold bg-secondery">
										View profile
									</a>
								</div>
							</div>

							<div className="text-sm font-medium space-y-6">
								<LeftMessage />
								<RightMessage />
								<DateMessage />
								<LeftMessage />
								<RightMessage />
								<DateMessage />
							</div>
						</div>

						<div className="flex items-center md:gap-4 gap-2 md:p-3 p-2 overflow-hidden">
							<div id="message__wrap" className="flex items-center gap-2 h-full dark:text-white -mt-1.5">
								<button type="button" className="shrink-0">
									<ion-icon className="text-3xl flex" name="happy-outline"></ion-icon>
								</button>
								<div className="dropbar p-2" uk-drop="stretch: x; target: #message__wrap ;animation: uk-animation-scale-up uk-transform-origin-bottom-left ;animate-out: true; pos: top-left ; offset:2; mode: click ; duration: 200 ">
									<div className="sm:w-60 bg-white shadow-lg border rounded-xl  pr-0 dark:border-slate-700 dark:bg-dark3">
										<h4 className="text-sm font-semibold p-3 pb-0">Send Imogi</h4>

										<div className="grid grid-cols-5 overflow-y-auto max-h-44 p-3 text-center text-xl">
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😊 </div>
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 🤩 </div>
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😎</div>
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 🥳 </div>
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😂 </div>
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 🥰 </div>
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😡 </div>
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😊 </div>
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 🤩 </div>
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😎</div>
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 🥳 </div>
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😂 </div>
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 🥰 </div>
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😡 </div>
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 🤔 </div>
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😊 </div>
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 🤩 </div>
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😎</div>
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 🥳 </div>
											<div className="hover:bg-secondery p-1.5 rounded-md hover:scale-125 cursor-pointer duration-200"> 😂 </div>
										</div>
									</div>
								</div>
							</div>

							<div className="relative flex-1">
								<textarea placeholder="Write your message" rows="1" className="w-full resize-none bg-secondery rounded-full px-4 p-2"></textarea>

								<button type="button" className="text-white shrink-0 p-2 absolute right-0.5 top-0">
									<ion-icon className="text-xl flex" name="send-outline"></ion-icon>
								</button>
							</div>

							<button type="button" className="flex h-full dark:text-white">
								<ion-icon className="text-3xl flex -mt-3" name="heart-outline"></ion-icon>
							</button>
						</div>
					</div>

					<div className="rightt w-full h-full absolute top-0 right-0 z-10 hidden transition-transform">
						<div className="w-[360px] border-l shadow-lg h-screen bg-white absolute right-0 top-0 uk-animation-slide-right-medium delay-200 z-50 dark:bg-dark2 dark:border-slate-700">
							<div className="w-full h-1.5 bg-gradient-to-r to-purple-500 via-red-500 from-pink-500 -mt-px"></div>

							<div className="py-10 text-center text-sm pt-20">
								<img src="assets/images/avatars/avatar-3.jpg" className="w-24 h-24 rounded-full mx-auto mb-3" alt="" />
								<div className="mt-8">
									<div className="md:text-xl text-base font-medium text-black dark:text-white"> Monroe Parker </div>
									<div className="text-gray-500 text-sm mt-1 dark:text-white/80">@Monroepark</div>
								</div>
								<div className="mt-5">
									<a href="timeline.html" className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold bg-secondery">
										View profile
									</a>
								</div>
							</div>

							<hr className="opacity-80 dark:border-slate-700" />

							<button type="button" className="absolute top-0 right-0 m-4 p-2 bg-secondery rounded-full" uk-toggle="target: .rightt ; cls: hidden">
								<ion-icon name="close" className="text-2xl flex"></ion-icon>
							</button>
						</div>

						<div className="bg-slate-100/40 backdrop-blur absolute w-full h-full dark:bg-slate-800/40" uk-toggle="target: .rightt ; cls: hidden"></div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default MainMessage;
