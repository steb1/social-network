import "../../public/assets/js/script.js";
import "../../public/assets/js/simplebar.js";

const MainProfile = () => {
	return (
		<main id="site__main" className="2xl:ml-[--w-side]  xl:ml-[--w-side-sm] p-2.5 h-[calc(100vh-var(--m-top))] mt-[--m-top]">
			<div className="max-w-[1065px] mx-auto max-lg:-m-2.5">
				<div className="bg-white shadow lg:rounded-b-2xl lg:-mt-10 dark:bg-dark2">
					<div className="relative overflow-hidden w-full lg:h-72 h-48">
						<img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="" className="h-full w-full object-cover inset-0" />

						<div className="w-full bottom-0 absolute left-0 bg-gradient-to-t from-black/60 pt-20 z-10"></div>
					</div>

					<div className="p-3">
						<div className="flex flex-col justify-center md:items-center lg:-mt-48 -mt-28">
							<div className="relative lg:h-48 lg:w-48 w-28 h-28 mb-4 z-10">
								<div className="relative overflow-hidden rounded-full md:border-[6px] border-gray-100 shrink-0 dark:border-slate-900 shadow">
									<img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="" className="h-full w-full object-cover inset-0" />
								</div>
							</div>

							<h3 className="md:text-3xl text-base font-bold text-black dark:text-white"> Fistname Lastname </h3>

							<p className="mt-2 text-gray-500 dark:text-white/80">NicknameOrEmail</p>

							<p className="mt-2 max-w-xl text-sm md:font-normal font-light text-center hidden"> I love beauty and emotion. 🥰 I’m passionate about photography and learning. 📚 I explore genres and styles. 🌈 I think photography is storytelling. 😊</p>
						</div>
					</div>

					<div className="flex items-center justify-between mt-3 border-t border-gray-100 px-2 max-lg:flex-col dark:border-slate-700" uk-sticky="offset:50; cls-active: bg-white/80 shadow rounded-b-2xl z-50 backdrop-blur-xl dark:!bg-slate-700/80; animation:uk-animation-slide-top ; media: 992">
						<div className="flex items-center gap-2 text-sm py-2 pr-1 max-md:w-full lg:order-2">
							<button className="button bg-primary flex items-center gap-2 text-white py-2 px-3.5 max-md:flex-1">
								<ion-icon name="add-circle" className="text-xl"></ion-icon>
								<span className="text-sm"> Follow</span>
							</button>
							<button className="button bg-primary flex items-center gap-2 text-white py-2 px-3.5 max-md:flex-1">
								<ion-icon name="add-circle" className="text-xl"></ion-icon>
								<span className="text-sm"> Contact </span>
							</button>
						</div>

						<nav className="flex gap-0.5 rounded-xl -mb-px text-gray-600 font-medium text-[15px]  dark:text-white max-md:w-full max-md:overflow-x-auto">
							<a href="#" className="inline-block  py-3 leading-8 px-3.5 cursor-text">
								Posts <span className="text-black text-sm pl-2 font-bold lg:inline-block hidden">10</span>
							</a>
							<a href="#" className="inline-block py-3 leading-8 px-3.5">
								Follower(s) <span className="text-black text-sm pl-2 font-bold  lg:inline-block hidden">2,680</span>
							</a>
							<a href="#" className="inline-block py-3 leading-8 px-3.5">
								Followee(s) <span className="text-black text-sm pl-2 font-bold lg:inline-block hidden">2,680</span>
							</a>
						</nav>
					</div>
				</div>

				<div className="flex 2xl:gap-12 gap-10 mt-8 max-lg:flex-col" id="js-oversized">
					<div className="flex-1 xl:space-y-6 space-y-3">
						<div className="bg-white rounded-xl shadow-sm p-4 space-y-4 text-sm font-medium border1 dark:bg-dark2">
							<div className="flex items-center gap-3">
								<div className="flex-1 bg-slate-100 hover:bg-opacity-80 transition-all rounded-lg cursor-pointer dark:bg-dark3" uk-toggle="target: #create-status">
									<div className="py-2.5 text-center dark:text-white"> What do you have in mind? </div>
								</div>
								<div className="cursor-pointer hover:bg-opacity-80 p-1 px-1.5 rounded-lg transition-all bg-pink-100/60 hover:bg-pink-100" uk-toggle="target: #create-status">
									<svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 stroke-pink-600 fill-pink-200/70" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<path d="M15 8h.01" />
										<path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" />
										<path d="M3.5 15.5l4.5 -4.5c.928 -.893 2.072 -.893 3 0l5 5" />
										<path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l2.5 2.5" />
									</svg>
								</div>
								<div className="cursor-pointer hover:bg-opacity-80 p-1 px-1.5 rounded-lg transition-all bg-sky-100/60 hover:bg-sky-100" uk-toggle="target: #create-status">
									<svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 stroke-sky-600 fill-sky-200/70 " viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" />
										<path d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
									</svg>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-sm text-sm font-medium border1 dark:bg-dark2">
							<div className="flex gap-3 sm:p-4 p-2.5 text-sm font-medium">
								<a href="timeline.html">
									{" "}
									<img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="" className="w-9 h-9 rounded-full" />{" "}
								</a>
								<div className="flex-1">
									<a href="timeline.html">
										<h4 className="text-black dark:text-white"> Monroe Parker </h4>
									</a>
									<div className="text-xs text-gray-500 dark:text-white/80"> 2 hours ago</div>
								</div>
							</div>

							<div className="relative w-full lg:h-96 h-full sm:px-4">
								<img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="" className="sm:rounded-lg w-full h-full object-cover" />
							</div>

							<div className="sm:p-4 p-2.5 flex items-center gap-4 text-xs font-semibold">
								<div>
									<div className="flex items-center gap-2.5">
										<button type="button" className="button-icon text-red-500 bg-red-100 dark:bg-slate-700">
											{" "}
											<ion-icon className="text-lg" name="heart"></ion-icon>{" "}
										</button>
										<a href="#">1,300</a>
									</div>
									<div className="p-1 px-2 bg-white rounded-full drop-shadow-md w-[212px] dark:bg-slate-700 text-2xl" uk-drop="offset:10;pos: top-left; animate-out: true; animation: uk-animation-scale-up uk-transform-origin-bottom-left">
										<div className="flex gap-2" uk-scrollspy="target: > button; cls: uk-animation-scale-up; delay: 100 ;repeat: true">
											<button type="button" className="text-red-600 hover:scale-125 duration-300">
												<span> 👍 </span>
											</button>
											<button type="button" className="text-red-600 hover:scale-125 duration-300">
												<span> ❤️ </span>
											</button>
											<button type="button" className="text-red-600 hover:scale-125 duration-300">
												<span> 😂 </span>
											</button>
											<button type="button" className="text-red-600 hover:scale-125 duration-300">
												<span> 😯 </span>
											</button>
											<button type="button" className="text-red-600 hover:scale-125 duration-300">
												<span> 😢 </span>
											</button>
										</div>

										<div className="w-2.5 h-2.5 absolute -bottom-1 left-3 bg-white rotate-45 hidden"></div>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<button type="button" className="button-icon bg-slate-200/70 dark:bg-slate-700">
										<ion-icon className="text-lg" name="chatbubble-ellipses"></ion-icon>{" "}
									</button>
									<span>260</span>
								</div>
								<button type="button" className="button-icon ml-auto">
									{" "}
									<ion-icon className="text-xl" name="paper-plane-outline"></ion-icon>{" "}
								</button>
								<button type="button" className="button-icon">
									{" "}
									<ion-icon className="text-xl" name="share-outline"></ion-icon>{" "}
								</button>
							</div>

							<div className="sm:p-4 p-2.5 border-t border-gray-100 font-normal space-y-3 relative dark:border-slate-700/40">
								<div className="flex items-start gap-3 relative">
									<a href="timeline.html">
										{" "}
										<img src="assets/images/avatars/avatar-2.jpg" alt="" className="w-6 h-6 mt-1 rounded-full" />{" "}
									</a>
									<div className="flex-1">
										<a href="timeline.html" className="text-black font-medium inline-block dark:text-white">
											{" "}
											Steeve{" "}
										</a>
										<p className="mt-0.5">What a beautiful photo! I love it. 😍 </p>
									</div>
								</div>
								<div className="flex items-start gap-3 relative">
									<a href="timeline.html">
										{" "}
										<img src="assets/images/avatars/avatar-3.jpg" alt="" className="w-6 h-6 mt-1 rounded-full" />{" "}
									</a>
									<div className="flex-1">
										<a href="timeline.html" className="text-black font-medium inline-block dark:text-white">
											{" "}
											Monroe{" "}
										</a>
										<p className="mt-0.5"> You captured the moment.😎 </p>
									</div>
								</div>

								<button type="button" className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 mt-2">
									<ion-icon name="chevron-down-outline" className="ml-auto duration-200 group-aria-expanded:rotate-180"></ion-icon>
									More Comment
								</button>
							</div>

							<div className="sm:px-4 sm:py-3 p-2.5 border-t border-gray-100 flex items-center gap-1 dark:border-slate-700/40">
								<img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="" className="w-6 h-6 rounded-full" />

								<div className="flex-1 relative overflow-hidden h-10">
									<textarea placeholder="Add Comment...." rows="1" className="w-full resize-none !bg-transparent px-4 py-2 focus:!border-transparent focus:!ring-transparent"></textarea>

									<div className="!top-2 pr-2" uk-drop="pos: bottom-right; mode: click">
										<div className="flex items-center gap-2" uk-scrollspy="target: > svg; cls: uk-animation-slide-right-small; delay: 100 ;repeat: true">
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-sky-600">
												<path
													fill-rule="evenodd"
													d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
													clip-rule="evenodd"
												/>
											</svg>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 fill-pink-600">
												<path d="M3.25 4A2.25 2.25 0 001 6.25v7.5A2.25 2.25 0 003.25 16h7.5A2.25 2.25 0 0013 13.75v-7.5A2.25 2.25 0 0010.75 4h-7.5zM19 4.75a.75.75 0 00-1.28-.53l-3 3a.75.75 0 00-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 001.28-.53V4.75z" />
											</svg>
										</div>
									</div>
								</div>

								<button type="submit" className="text-sm rounded-full py-1.5 px-3.5 bg-secondery">
									Replay
								</button>
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-sm text-sm font-medium border1 dark:bg-dark2">
							<div className="flex gap-3 sm:p-4 p-2.5 text-sm font-medium">
								<a href="timeline.html">
									{" "}
									<img src="assets/images/avatars/avatar-5.jpg" alt="" className="w-9 h-9 rounded-full" />{" "}
								</a>
								<div className="flex-1">
									<a href="timeline.html">
										<h4 className="text-black dark:text-white"> John Michael </h4>
									</a>
									<div className="text-xs text-gray-500 dark:text-white/80"> 2 hours ago</div>
								</div>

								<div className="-mr-1">
									<button type="button" className="button__ico w-8 h-8" aria-haspopup="true" aria-expanded="false">
										{" "}
										<ion-icon className="text-xl md hydrated" name="ellipsis-horizontal" role="img" aria-label="ellipsis horizontal"></ion-icon>{" "}
									</button>
									<div className="w-[245px] uk-dropdown" uk-dropdown="pos: bottom-right; animation: uk-animation-scale-up uk-transform-origin-top-right; animate-out: true; mode: click">
										<nav>
											<a href="#">
												{" "}
												<ion-icon className="text-xl shrink-0 md hydrated" name="bookmark-outline" role="img" aria-label="bookmark outline"></ion-icon> Add to favorites{" "}
											</a>
											<a href="#">
												{" "}
												<ion-icon className="text-xl shrink-0 md hydrated" name="notifications-off-outline" role="img" aria-label="notifications off outline"></ion-icon> Mute Notification
											</a>
											<a href="#">
												{" "}
												<ion-icon className="text-xl shrink-0 md hydrated" name="flag-outline" role="img" aria-label="flag outline"></ion-icon>
												Report this post{" "}
											</a>
											<a href="#">
												{" "}
												<ion-icon className="text-xl shrink-0 md hydrated" name="share-outline" role="img" aria-label="share outline"></ion-icon> Share your profile{" "}
											</a>
											<hr />
											<a href="#" className="text-red-400 hover:!bg-red-50 dark:hover:!bg-red-500/50">
												<ion-icon className="text-xl shrink-0 md hydrated" name="stop-circle-outline" role="img" aria-label="stop circle outline"></ion-icon> Unfollow{" "}
											</a>
										</nav>
									</div>
								</div>
							</div>

							<div className="sm:px-4 p-2.5 pt-0">
								<p className="font-normal"> Photography is the art of capturing light with a camera. It can be used to create images that tell stories, express emotions, or document reality. it can be fun, challenging, or rewarding. It can also be a hobby, a profession, or a passion. 📷 </p>
							</div>

							<div className="sm:p-4 p-2.5 flex items-center gap-4 text-xs font-semibold">
								<div>
									<div className="flex items-center gap-2.5">
										<button type="button" className="button-icon text-red-500 bg-red-100 dark:bg-slate-700">
											{" "}
											<ion-icon className="text-lg" name="heart"></ion-icon>{" "}
										</button>
										<a href="#">1,300</a>
									</div>
									<div className="p-1 px-2 bg-white rounded-full drop-shadow-md w-[212px] dark:bg-slate-700 text-2xl" uk-drop="offset:10;pos: top-left; animate-out: true; animation: uk-animation-scale-up uk-transform-origin-bottom-left">
										<div className="flex gap-2" uk-scrollspy="target: > button; cls: uk-animation-scale-up; delay: 100 ;repeat: true">
											<button type="button" className="text-red-600 hover:scale-125 duration-300">
												<span> 👍 </span>
											</button>
											<button type="button" className="text-red-600 hover:scale-125 duration-300">
												<span> ❤️ </span>
											</button>
											<button type="button" className="text-red-600 hover:scale-125 duration-300">
												<span> 😂 </span>
											</button>
											<button type="button" className="text-red-600 hover:scale-125 duration-300">
												<span> 😯 </span>
											</button>
											<button type="button" className="text-red-600 hover:scale-125 duration-300">
												<span> 😢 </span>
											</button>
										</div>

										<div className="w-2.5 h-2.5 absolute -bottom-1 left-3 bg-white rotate-45 hidden"></div>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<button type="button" className="button-icon bg-slate-200/70 dark:bg-slate-700">
										<ion-icon className="text-lg" name="chatbubble-ellipses"></ion-icon>{" "}
									</button>
									<span>260</span>
								</div>
								<button type="button" className="button-icon ml-auto">
									{" "}
									<ion-icon className="text-xl" name="paper-plane-outline"></ion-icon>{" "}
								</button>
								<button type="button" className="button-icon">
									{" "}
									<ion-icon className="text-xl" name="share-outline"></ion-icon>{" "}
								</button>
							</div>

							<div className="sm:p-4 p-2.5 border-t border-gray-100 font-normal space-y-3 relative dark:border-slate-700/40">
								<div className="flex items-start gap-3 relative">
									<a href="timeline.html">
										{" "}
										<img src="assets/images/avatars/avatar-2.jpg" alt="" className="w-6 h-6 mt-1 rounded-full" />{" "}
									</a>
									<div className="flex-1">
										<a href="timeline.html" className="text-black font-medium inline-block dark:text-white">
											{" "}
											Steeve{" "}
										</a>
										<p className="mt-0.5"> I love taking photos of nature and animals. 🌳🐶</p>
									</div>
								</div>
								<div className="flex items-start gap-3 relative">
									<a href="timeline.html">
										{" "}
										<img src="assets/images/avatars/avatar-3.jpg" alt="" className="w-6 h-6 mt-1 rounded-full" />{" "}
									</a>
									<div className="flex-1">
										<a href="timeline.html" className="text-black font-medium inline-block dark:text-white">
											{" "}
											Monroe{" "}
										</a>
										<p className="mt-0.5"> I enjoy people and emotions. 😊😢 </p>
									</div>
								</div>
								<div className="flex items-start gap-3 relative">
									<a href="timeline.html">
										{" "}
										<img src="assets/images/avatars/avatar-5.jpg" alt="" className="w-6 h-6 mt-1 rounded-full" />{" "}
									</a>
									<div className="flex-1">
										<a href="timeline.html" className="text-black font-medium inline-block dark:text-white">
											{" "}
											Jesse{" "}
										</a>
										<p className="mt-0.5"> Photography is my passion. 🎨📸 </p>
									</div>
								</div>
							</div>

							<div className="sm:px-4 sm:py-3 p-2.5 border-t border-gray-100 flex items-center gap-1 dark:border-slate-700/40">
								<img src="assets/images/avatars/avatar-7.jpg" alt="" className="w-6 h-6 rounded-full" />

								<div className="flex-1 relative overflow-hidden h-10">
									<textarea placeholder="Add Comment...." rows="1" className="w-full resize-none !bg-transparent px-4 py-2 focus:!border-transparent focus:!ring-transparent" aria-haspopup="true" aria-expanded="false"></textarea>

									<div className="!top-2 pr-2 uk-drop" uk-drop="pos: bottom-right; mode: click">
										<div className="flex items-center gap-2" uk-scrollspy="target: > svg; cls: uk-animation-slide-right-small; delay: 100 ;repeat: true">
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-sky-600" style={{ opacity: 0 }}>
												<path
													fill-rule="evenodd"
													d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
													clip-rule="evenodd"
												></path>
											</svg>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 fill-pink-600" style={{ opacity: 0 }}>
												<path d="M3.25 4A2.25 2.25 0 001 6.25v7.5A2.25 2.25 0 003.25 16h7.5A2.25 2.25 0 0013 13.75v-7.5A2.25 2.25 0 0010.75 4h-7.5zM19 4.75a.75.75 0 00-1.28-.53l-3 3a.75.75 0 00-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 001.28-.53V4.75z"></path>
											</svg>
										</div>
									</div>
								</div>

								<button type="submit" className="text-sm rounded-full py-1.5 px-3.5 bg-secondery">
									Replay
								</button>
							</div>
						</div>
					</div>

					<div className="lg:w-[400px]">
						<div className="lg:space-y-4 lg:pb-8 max-lg:grid sm:grid-cols-2 max-lg:gap-6" uk-sticky="media: 1024; end: #js-oversized; offset: 80">
							<div className="box p-5 px-6">
								<ul className="text-gray-700 space-y-4 mt-4 text-sm dark:text-white/80">
									<li className="flex items-center gap-3">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
										</svg>
										<div>Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le faux-texte dès qu'il est prêt ou que la mise en page est achevée. Généralement, on utilise un texte en faux latin, le Lorem ipsum ou Lipsum.</div>
									</li>
								</ul>

								<br />

								<div className="box p-5 px-6">
									<div className="flex items-ce justify-between text-black dark:text-white">
										<h3 className="font-bold text-lg">
											{" "}
											Friends
											<span className="block text-sm text-gray-500 mt-0. font-normal dark:text-white">3489 Friends </span>
										</h3>
									</div>

									<div className="grid grid-cols-3 gap-2 gap-y-5 text-center text-sm mt-4 mb-2">
										<div>
											<div className="relative w-full aspect-square rounded-lg overflow-hidden">
												<img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="" className="object-cover w-full h-full inset-0" />
											</div>
											<div className="mt-2 line-clamp-1"> Jesse Steeve </div>
										</div>
										<div>
											<div className="relative w-full aspect-square rounded-lg overflow-hidden">
												<img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="" className="object-cover w-full h-full inset-0" />
											</div>
											<div className="mt-2 line-clamp-1"> John Michael </div>
										</div>
										<div>
											<div className="relative w-full aspect-square rounded-lg overflow-hidden">
												<img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="" className="object-cover w-full h-full inset-0" />
											</div>
											<div className="mt-2 line-clamp-1"> Monroe Parker </div>
										</div>
										<div>
											<div className="relative w-full aspect-square rounded-lg overflow-hidden">
												<img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="" className="object-cover w-full h-full inset-0" />
											</div>
											<div className="mt-2 line-clamp-1"> Martin Gray </div>
										</div>
										<div>
											<div className="relative w-full aspect-square rounded-lg overflow-hidden">
												<img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="" className="object-cover w-full h-full inset-0" />
											</div>
											<div className="mt-2 line-clamp-1"> James Lewis </div>
										</div>
										<div>
											<div className="relative w-full aspect-square rounded-lg overflow-hidden">
												<img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="" className="object-cover w-full h-full inset-0" />
											</div>
											<div className="mt-2 line-clamp-1"> Alexa stella </div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default MainProfile;
