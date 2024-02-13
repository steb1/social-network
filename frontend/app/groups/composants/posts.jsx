export const PostImage = () => {
    return (            
            <div className="bg-white rounded-xl shadow-sm text-sm font-medium border1 dark:bg-dark2">
                {/* post heading */}
                <div className="flex gap-3 sm:p-4 p-2.5 text-sm font-medium">
                <a href="timeline.html"> <img src="assets/images/avatars/avatar-3.jpg"  className="w-9 h-9 rounded-full" /> </a>  
                <div className="flex-1">
                    <a href="timeline.html"> <h4 className="text-black dark:text-white"> Monroe Parker </h4> </a>  
                    <div className="text-xs text-gray-500 dark:text-white/80"> 2 hours ago</div>
                </div>
                <div className="-mr-1">
                    <button type="button" className="button-icon w-8 h-8"> <ion-icon className="text-xl" name="ellipsis-horizontal" /> </button>
                    <div className="w-[245px]" uk-dropdown="pos: bottom-right; animation: uk-animation-scale-up uk-transform-origin-top-right; animate-out: true; mode: click"> 
                    <nav> 
                        <a href="#"> <ion-icon className="text-xl shrink-0" name="bookmark-outline" />  Add to favorites </a>  
                        <a href="#"> <ion-icon className="text-xl shrink-0" name="notifications-off-outline" /> Mute Notification </a>  
                        <a href="#"> <ion-icon className="text-xl shrink-0" name="flag-outline" />  Report this post </a>  
                        <a href="#"> <ion-icon className="text-xl shrink-0" name="share-outline" />  Share your profile </a>  
                        <hr />
                        <a href="#" className="text-red-400 hover:!bg-red-50 dark:hover:!bg-red-500/50"> <ion-icon className="text-xl shrink-0" name="stop-circle-outline" />  Unfollow </a>  
                    </nav>
                    </div>
                </div>
                </div>
                {/* post image */}
                <a href="#preview_modal" >
                <div className="relative w-full lg:h-96 h-full sm:px-4">
                    <img src="assets/images/post/img-2.jpg"  className="sm:rounded-lg w-full h-full object-cover" />
                </div>
                </a>
                {/* post icons */}
                <div className="sm:p-4 p-2.5 flex items-center gap-4 text-xs font-semibold">
                <div>
                    <div className="flex items-center gap-2.5">
                    <button type="button" className="button-icon text-red-500 bg-red-100 dark:bg-slate-700"> <ion-icon className="text-lg" name="heart" /> </button>
                    <a href="#">1,300</a>
                    </div>
                    
                </div>
                <div className="flex items-center gap-3">
                    <button type="button" className="button-icon bg-slate-200/70 dark:bg-slate-700"> <ion-icon className="text-lg" name="chatbubble-ellipses" /> </button>
                    <span>260</span>
                </div>
                <button type="button" className="button-icon ml-auto"> <ion-icon className="text-xl" name="paper-plane-outline" /> </button>
                <button type="button" className="button-icon"> <ion-icon className="text-xl" name="share-outline" /> </button>
                </div>
                {/* comments */}
                <div className="sm:p-4 p-2.5 border-t border-gray-100 font-normal space-y-3 relative dark:border-slate-700/40"> 
                <div className="flex items-start gap-3 relative">
                    <a href="timeline.html"> <img src="assets/images/avatars/avatar-2.jpg"  className="w-6 h-6 mt-1 rounded-full" /> </a>
                    <div className="flex-1">
                    <a href="timeline.html" className="text-black font-medium inline-block dark:text-white"> Steeve </a>
                    <p className="mt-0.5">What a beautiful photo! I love it. 😍 </p>
                    </div>
                </div>
                <div className="flex items-start gap-3 relative">
                    <a href="timeline.html"> <img src="assets/images/avatars/avatar-3.jpg"  className="w-6 h-6 mt-1 rounded-full" /> </a>
                    <div className="flex-1">
                    <a href="timeline.html" className="text-black font-medium inline-block dark:text-white"> Monroe </a>
                    <p className="mt-0.5">   You captured the moment.😎 </p>
                    </div>
                </div>
                <button type="button" className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 mt-2">
                    <ion-icon name="chevron-down-outline" className="ml-auto duration-200 group-aria-expanded:rotate-180" />
                    More Comment
                </button>
                </div>
                {/* add comment */}
                <div className="sm:px-4 sm:py-3 p-2.5 border-t border-gray-100 flex items-center gap-1 dark:border-slate-700/40">
                <img src="assets/images/avatars/avatar-7.jpg"  className="w-6 h-6 rounded-full" />
                <div className="flex-1 relative overflow-hidden h-10">
                    <textarea placeholder="Add Comment...." rows={1} className="w-full resize-none !bg-transparent px-4 py-2 focus:!border-transparent focus:!ring-transparent" defaultValue={""} />
                    <div className="!top-2 pr-2" uk-drop="pos: bottom-right; mode: click">
                    <div className="flex items-center gap-2" uk-scrollspy="target: > svg; cls: uk-animation-slide-right-small; delay: 100 ;repeat: true">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-sky-600">
                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 fill-pink-600">
                        <path d="M3.25 4A2.25 2.25 0 001 6.25v7.5A2.25 2.25 0 003.25 16h7.5A2.25 2.25 0 0013 13.75v-7.5A2.25 2.25 0 0010.75 4h-7.5zM19 4.75a.75.75 0 00-1.28-.53l-3 3a.75.75 0 00-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 001.28-.53V4.75z" />
                        </svg>
                    </div>
                    </div>
                </div>
                <button type="submit" className="text-sm rounded-full py-1.5 px-3.5 bg-secondery"> Replay</button>
                </div> 

                {/* create status */}
                <div className=" hidden lg:p-20 uk- open" id="create-status">
                    <div className="uk-modal-dialog tt relative overflow-hidden mx-auto bg-white shadow-xl rounded-lg md:w-[520px] w-full dark:bg-dark2">
                    <div className="text-center py-4 border-b mb-0 dark:border-slate-700">
                        <h2 className="text-sm font-medium text-black"> Create Status </h2>
                        {/* close button */}
                        <button type="button" className="button-icon absolute top-0 right-0 m-2.5 uk-modal-close">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        </button>
                    </div>
                    <div className="space-y-5 mt-3 p-2">
                        <textarea className="w-full !text-black placeholder:!text-black !bg-white !border-transparent focus:!border-transparent focus:!ring-transparent !font-normal !text-xl   dark:!text-white dark:placeholder:!text-white dark:!bg-slate-800"   rows={6} placeholder="What do you have in mind?" defaultValue={""} />
                    </div>
                    <div className="flex items-center gap-2 text-sm py-2 px-4 font-medium flex-wrap">
                        <button type="button" className="flex items-center gap-1.5 bg-sky-50 text-sky-600 rounded-full py-1 px-2 border-2 border-sky-100 dark:bg-sky-950 dark:border-sky-900">  
                        <ion-icon name="image" className="text-base" />  
                        Image 
                        </button>
                        <button type="button" className="flex items-center gap-1.5 bg-teal-50 text-teal-600 rounded-full py-1 px-2 border-2 border-teal-100 dark:bg-teal-950 dark:border-teal-900">  
                        <ion-icon name="videocam" className="text-base" />  
                        Video 
                        </button>
                        <button type="button" className="flex items-center gap-1.5 bg-orange-50 text-orange-600 rounded-full py-1 px-2 border-2 border-orange-100 dark:bg-yellow-950 dark:border-yellow-900">  
                        <ion-icon name="happy" className="text-base" />  
                        Feeling
                        </button>
                        <button type="button" className="flex items-center gap-1.5 bg-red-50 text-red-600 rounded-full py-1 px-2 border-2 border-rose-100 dark:bg-rose-950 dark:border-rose-900">  
                        <ion-icon name="location" className="text-base" />  
                        Check in 
                        </button>
                        <button type="button" className="grid place-items-center w-8 h-8 text-xl rounded-full bg-secondery">  
                        <ion-icon name="ellipsis-horizontal" />
                        </button>
                    </div>
                    <div className="p-5 flex justify-between items-center">
                        <div>
                        <button className="inline-flex items-center py-1 px-2.5 gap-1 font-medium text-sm rounded-full bg-slate-50 border-2 border-slate-100 group aria-expanded:bg-slate-100 aria-expanded: dark:text-white dark:bg-slate-700 dark:border-slate-600" type="button"> 
                            Everyone
                            <ion-icon name="chevron-down-outline" className="text-base duration-500 group-aria-expanded:rotate-180" /> 
                        </button>
                        <div className="p-2 bg-white rounded-lg shadow-lg text-black font-medium border border-slate-100 w-60 dark:bg-slate-700" uk-drop="offset:10;pos: bottom-left; reveal-left;animate-out: true; animation: uk-animation-scale-up uk-transform-origin-bottom-left ; mode:click">
                            <form>
                            <label>
                                <input type="radio" name="radio-status" id="monthly1" className="peer appearance-none hidden" defaultChecked />
                                <div className=" relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                <div className="text-sm">  Everyone </div> 
                                <ion-icon name="checkmark-circle" className="hidden active absolute -translate-y-1/2 right-2 text-2xl text-blue-600 uk-animation-scale-up" />
                                </div>
                            </label>
                            <label>
                                <input type="radio" name="radio-status" id="monthly1" className="peer appearance-none hidden" />
                                <div className=" relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                <div className="text-sm"> Friends </div> 
                                <ion-icon name="checkmark-circle" className="hidden active absolute -translate-y-1/2 right-2 text-2xl text-blue-600 uk-animation-scale-up" />
                                </div>
                            </label>
                            <label>
                                <input type="radio" name="radio-status" id="monthly" className="peer appearance-none hidden" />
                                <div className=" relative flex items-center justify-between cursor-pointer rounded-md p-2 px-3 hover:bg-secondery peer-checked:[&_.active]:block dark:bg-dark3">
                                <div className="text-sm"> Only me </div> 
                                <ion-icon name="checkmark-circle" className="hidden active absolute -translate-y-1/2 right-2 text-2xl text-blue-600 uk-animation-scale-up" />
                                </div>
                            </label>
                            </form>
                        </div>
                        </div>
                        <div className="flex items-center gap-2"> 
                        <button type="button" className="button bg-blue-500 text-white py-2 px-12 text-[14px]"> Create</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>  

                      

    )
}

export const PostImageSlider = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm text-sm font-medium border1 dark:bg-dark2">
                {/* post heading */}
                <div className="flex gap-3 sm:p-4 p-2.5 text-sm font-medium">
                <a href="timeline.html"> <img src="assets/images/avatars/avatar-3.jpg"  className="w-9 h-9 rounded-full" /> </a>  
                <div className="flex-1">
                    <a href="timeline.html"> <h4 className="text-black dark:text-white"> Monroe Parker </h4> </a>  
                    <div className="text-xs text-gray-500 dark:text-white/80"> 2 hours ago</div>
                </div>
                <div className="-mr-1">
                    <button type="button" className="button-icon w-8 h-8"> <ion-icon className="text-xl" name="ellipsis-horizontal" /> </button>
                    <div className="w-[245px]" uk-dropdown="pos: bottom-right; animation: uk-animation-scale-up uk-transform-origin-top-right; animate-out: true; mode: click"> 
                    <nav> 
                        <a href="#"> <ion-icon className="text-xl shrink-0" name="bookmark-outline" />  Add to favorites </a>  
                        <a href="#"> <ion-icon className="text-xl shrink-0" name="notifications-off-outline" /> Mute Notification </a>  
                        <a href="#"> <ion-icon className="text-xl shrink-0" name="flag-outline" />  Report this post </a>  
                        <a href="#"> <ion-icon className="text-xl shrink-0" name="share-outline" />  Share your profile </a>  
                        <hr />
                        <a href="#" className="text-red-400 hover:!bg-red-50 dark:hover:!bg-red-500/50"> <ion-icon className="text-xl shrink-0" name="stop-circle-outline" />  Unfollow </a>  
                    </nav>
                    </div>
                </div>
                </div>
                {/* post image */}
                <a href="#preview_modal" >
                <div className="relative w-full lg:h-96 h-full sm:px-4">
                    <img src="assets/images/post/img-2.jpg"  className="sm:rounded-lg w-full h-full object-cover" />
                </div>
                </a>
                {/* post icons */}
                <div className="sm:p-4 p-2.5 flex items-center gap-4 text-xs font-semibold">
                <div>
                    <div className="flex items-center gap-2.5">
                    <button type="button" className="button-icon text-red-500 bg-red-100 dark:bg-slate-700"> <ion-icon className="text-lg" name="heart" /> </button>
                    <a href="#">1,300</a>
                    </div>
                    
                </div>
                <div className="flex items-center gap-3">
                    <button type="button" className="button-icon bg-slate-200/70 dark:bg-slate-700"> <ion-icon className="text-lg" name="chatbubble-ellipses" /> </button>
                    <span>260</span>
                </div>
                <button type="button" className="button-icon ml-auto"> <ion-icon className="text-xl" name="paper-plane-outline" /> </button>
                <button type="button" className="button-icon"> <ion-icon className="text-xl" name="share-outline" /> </button>
                </div>
                {/* comments */}
                <div className="sm:p-4 p-2.5 border-t border-gray-100 font-normal space-y-3 relative dark:border-slate-700/40"> 
                <div className="flex items-start gap-3 relative">
                    <a href="timeline.html"> <img src="assets/images/avatars/avatar-2.jpg"  className="w-6 h-6 mt-1 rounded-full" /> </a>
                    <div className="flex-1">
                    <a href="timeline.html" className="text-black font-medium inline-block dark:text-white"> Steeve </a>
                    <p className="mt-0.5">What a beautiful photo! I love it. 😍 </p>
                    </div>
                </div>
                <div className="flex items-start gap-3 relative">
                    <a href="timeline.html"> <img src="assets/images/avatars/avatar-3.jpg"  className="w-6 h-6 mt-1 rounded-full" /> </a>
                    <div className="flex-1">
                    <a href="timeline.html" className="text-black font-medium inline-block dark:text-white"> Monroe </a>
                    <p className="mt-0.5">   You captured the moment.😎 </p>
                    </div>
                </div>
                <button type="button" className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 mt-2">
                    <ion-icon name="chevron-down-outline" className="ml-auto duration-200 group-aria-expanded:rotate-180" />
                    More Comment
                </button>
                </div>
                {/* add comment */}
                <div className="sm:px-4 sm:py-3 p-2.5 border-t border-gray-100 flex items-center gap-1 dark:border-slate-700/40">
                <img src="assets/images/avatars/avatar-7.jpg"  className="w-6 h-6 rounded-full" />
                <div className="flex-1 relative overflow-hidden h-10">
                    <textarea placeholder="Add Comment...." rows={1} className="w-full resize-none !bg-transparent px-4 py-2 focus:!border-transparent focus:!ring-transparent" defaultValue={""} />
                    <div className="!top-2 pr-2" uk-drop="pos: bottom-right; mode: click">
                    <div className="flex items-center gap-2" uk-scrollspy="target: > svg; cls: uk-animation-slide-right-small; delay: 100 ;repeat: true">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-sky-600">
                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 fill-pink-600">
                        <path d="M3.25 4A2.25 2.25 0 001 6.25v7.5A2.25 2.25 0 003.25 16h7.5A2.25 2.25 0 0013 13.75v-7.5A2.25 2.25 0 0010.75 4h-7.5zM19 4.75a.75.75 0 00-1.28-.53l-3 3a.75.75 0 00-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 001.28-.53V4.75z" />
                        </svg>
                    </div>
                    </div>
                </div>
                <button type="submit" className="text-sm rounded-full py-1.5 px-3.5 bg-secondery"> Replay</button>
                </div> 
            </div>
        
    )
}

export const PostText = ( { post , setGroups }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm text-sm font-medium border1 dark:bg-dark2">
            {/* post text*/}
                {/* post heading */}
                <div className="flex gap-3 sm:p-4 p-2.5 text-sm font-medium">
                <a href="timeline.html"> <img src="assets/images/avatars/avatar-5.jpg"  className="w-9 h-9 rounded-full" /> { post.AuthorName } </a> 
                <div className="flex-1">
                    <a href="timeline.html"> <h4 className="text-black dark:text-white">  </h4> </a> 
                    <div className="text-xs text-gray-500 dark:text-white/80"> 2 hours ago</div>
                </div>
                <div className="-mr-1">
                    <button type="button" className="button__ico w-8 h-8" aria-haspopup="true" aria-expanded="false"> <ion-icon className="text-xl md hydrated" name="ellipsis-horizontal" role="img" aria-label="ellipsis horizontal" /> </button>
                    <div className="w-[245px] uk-dropdown" uk-dropdown="pos: bottom-right; animation: uk-animation-scale-up uk-transform-origin-top-right; animate-out: true; mode: click"> 
                    <nav> 
                        <a href="#"> <ion-icon className="text-xl shrink-0 md hydrated" name="bookmark-outline" role="img" aria-label="bookmark outline" />  Add to favorites </a>  
                        <a href="#"> <ion-icon className="text-xl shrink-0 md hydrated" name="notifications-off-outline" role="img" aria-label="notifications off outline" /> Mute Notification </a>  
                        <a href="#"> <ion-icon className="text-xl shrink-0 md hydrated" name="flag-outline" role="img" aria-label="flag outline" />  Report this post </a>  
                        <a href="#"> <ion-icon className="text-xl shrink-0 md hydrated" name="share-outline" role="img" aria-label="share outline" />  Share your profile </a>  
                        <hr />
                        <a href="#" className="text-red-400 hover:!bg-red-50 dark:hover:!bg-red-500/50"> <ion-icon className="text-xl shrink-0 md hydrated" name="stop-circle-outline" role="img" aria-label="stop circle outline" />  Unfollow </a>  
                    </nav>
                    </div>
                </div>
                </div>
                <div className="sm:px-4 p-2.5 pt-0">
                <p className="font-normal"> { post.Content } </p>
                </div> 
                {/* post icons */}
                <div className="sm:p-4 p-2.5 flex items-center gap-4 text-xs font-semibold">
                <div>
                    <div className="flex items-center gap-2.5">
                    <button type="button" className="button-icon text-red-500 bg-red-100 dark:bg-slate-700"> <ion-icon className="text-lg" name="heart" /> </button>
                    <a href="#">1,300</a>
                    </div>
                    
                </div>
                <div className="flex items-center gap-3">
                    <button type="button" className="button-icon bg-slate-200/70 dark:bg-slate-700"> <ion-icon className="text-lg" name="chatbubble-ellipses" /> </button>
                    <span>260</span>
                </div>
                <button type="button" className="button-icon ml-auto"> <ion-icon className="text-xl" name="paper-plane-outline" /> </button>
                <button type="button" className="button-icon"> <ion-icon className="text-xl" name="share-outline" /> </button>
                </div>
                {/* comments */}
                <div className="sm:p-4 p-2.5 border-t border-gray-100 font-normal space-y-3 relative dark:border-slate-700/40"> 
                <div className="flex items-start gap-3 relative">
                    <a href="timeline.html"> <img src="assets/images/avatars/avatar-2.jpg"  className="w-6 h-6 mt-1 rounded-full" /> </a>
                    <div className="flex-1">
                    <a href="timeline.html" className="text-black font-medium inline-block dark:text-white"> Steeve </a>
                    <p className="mt-0.5"> I love taking photos of nature and animals. 🌳🐶</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 relative">
                    <a href="timeline.html"> <img src="assets/images/avatars/avatar-3.jpg"  className="w-6 h-6 mt-1 rounded-full" /> </a>
                    <div className="flex-1">
                    <a href="timeline.html" className="text-black font-medium inline-block dark:text-white"> Monroe </a>
                    <p className="mt-0.5">  I enjoy people and emotions. 😊😢 </p>
                    </div>
                </div> 
                <div className="flex items-start gap-3 relative">
                    <a href="timeline.html"> <img src="assets/images/avatars/avatar-5.jpg"  className="w-6 h-6 mt-1 rounded-full" /> </a>
                    <div className="flex-1">
                    <a href="timeline.html" className="text-black font-medium inline-block dark:text-white"> Jesse </a>
                    <p className="mt-0.5">  Photography is my passion. 🎨📸 </p>
                    </div>
                </div>
                </div>
                {/* add comment */}
                <div className="sm:px-4 sm:py-3 p-2.5 border-t border-gray-100 flex items-center gap-1 dark:border-slate-700/40">
                <img src="assets/images/avatars/avatar-7.jpg"  className="w-6 h-6 rounded-full" />
                <div className="flex-1 relative overflow-hidden h-10">
                    <textarea placeholder="Add Comment...." rows={1} className="w-full resize-none !bg-transparent px-4 py-2 focus:!border-transparent focus:!ring-transparent" aria-haspopup="true" aria-expanded="false" defaultValue={""} />
                    <div className="!top-2 pr-2 uk-drop" uk-drop="pos: bottom-right; mode: click">
                    <div className="flex items-center gap-2" uk-scrollspy="target: > svg; cls: uk-animation-slide-right-small; delay: 100 ;repeat: true">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-sky-600" style={{opacity: 0}}>
                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 fill-pink-600" style={{opacity: 0}}>
                        <path d="M3.25 4A2.25 2.25 0 001 6.25v7.5A2.25 2.25 0 003.25 16h7.5A2.25 2.25 0 0013 13.75v-7.5A2.25 2.25 0 0010.75 4h-7.5zM19 4.75a.75.75 0 00-1.28-.53l-3 3a.75.75 0 00-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 001.28-.53V4.75z" />
                        </svg>
                    </div>
                    </div>
                </div>
                <button type="submit" className="text-sm rounded-full py-1.5 px-3.5 bg-secondery"> Replay</button>
                </div> 
            </div>
    )
}

export const PostPlaceholder = () => {
    return (
        <div className="rounded-xl shadow-sm p-4 space-y-4 bg-slate-200/40 animate-pulse border1 dark:bg-dark2">
                <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-300/20" />
                <div className="flex-1 space-y-3">
                    <div className="w-40 h-5 rounded-md bg-slate-300/20" />
                    <div className="w-24 h-4 rounded-md bg-slate-300/20" />
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-300/20" />
                </div>
                <div className="w-full h-52 rounded-lg bg-slate-300/10 my-3"> </div>
                <div className="flex gap-3">
                <div className="w-16 h-5 rounded-md bg-slate-300/20" />
                <div className="w-14 h-5 rounded-md bg-slate-300/20" />
                <div className="w-6 h-6 rounded-full bg-slate-300/20 ml-auto" />
                <div className="w-6 h-6 rounded-full bg-slate-300/20  " />
                </div>
        </div>
    )
}
