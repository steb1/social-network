export const GroupCover = ( { groupInfo, setTab , tab, isowner }) => {
    return (
    <div className="bg-white shadow lg:rounded-b-2xl lg:-mt-10 dark:bg-dark2" >
        {/* cover */}
        <div className="relative overflow-hidden w-full lg:h-72 h-36">
            <img src="../../assets/images/group/banniere.jpg" alt="" className="h-full w-full object-cover inset-0" />
            {/* overly */}
            <div className="w-full bottom-0 absolute left-0 bg-gradient-to-t from -black/60 pt-10 z-10" />
            <div className="absolute bottom-0 right-0 m-4 z-20">
            <div className="flex items-center gap-3">
                <button className="button bg-white/20 text-white flex items-center gap-2 backdrop-blur-small">Crop</button>
                <button className="button bg-black/10 text-white flex items-center gap-2 backdrop-blur-small">Edit</button>
            </div>
            </div>
        </div>
        <div className="lg:px-10 md:p-5 p-3">
            <div className="flex flex-col justify-center">
            <div className="flex lg:items-center justify-between max-md:flex-col">
                <div className="flex-1"> 
                <h3 className="md:text-2xl text-base font-bold text-black dark:text-white"> { groupInfo ? (groupInfo.title) : '' } </h3>
                <p className=" font-normal text-gray-500 mt-2 flex gap-2 flex-wrap dark:text-white/80">
                    <span className="max-lg:hidden"> { groupInfo ? (groupInfo.description ) : '' } </span>
                    <span className="max-lg:hidden"> •  </span>
                    <span className="max-lg:hidden">Created by { groupInfo.User ? (`${groupInfo.User.first_name} ${groupInfo.User.last_name}` ) : ' ' } </span>
                </p>
                </div>
                <div>
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex -space-x-4 mr-3">
                    <img src="../assets/images/avatars/avatar-2.jpg" alt="" className="w-10 rounded-full border-4 border-white dark:border-slate-800" />
                    <img src="../assets/images/avatars/avatar-3.jpg" alt="" className="w-10 rounded-full border-4 border-white dark:border-slate-800" />
                    <img src="../assets/images/avatars/avatar-7.jpg" alt="" className="w-10 rounded-full border-4 border-white dark:border-slate-800" />
                    <img src="../assets/images/avatars/avatar-4.jpg" alt="" className="w-10 rounded-full border-4 border-white dark:border-slate-800" />
                    <img src="../assets/images/avatars/avatar-5.jpg" alt="" className="w-10 rounded-full border-4 border-white dark:border-slate-800" />
                    </div>
                    
                    <div> 
                    <button type="button" className="rounded-lg bg-secondery flex px-2.5 py-2 dark:bg-dark2"> 
                        <ion-icon name="ellipsis-horizontal" className="text-xl">
                        </ion-icon></button>
                    <div className="w-[240px]" uk-dropdown="pos: bottom-right; animation: uk-animation-scale-up uk-transform-origin-top-right; animate-out: true; mode: click;offset:10"> 
                        <nav>
                        <a href="#"> <ion-icon className="text-xl" name="flag-outline" />  Report group</a>  
                        <a href="#"> <ion-icon className="text-xl" name="pricetags-outline" /> Unfollow </a>  
                        <a href="#"> <ion-icon className="text-xl" name="share-outline" /> Share</a>  
                        <a href="#"> <ion-icon className="text-xl" name="link-outline" />  Copy link </a>  
                        <a href="#"> <ion-icon className="text-xl" name="chatbubble-ellipses-outline" />  Sort comments </a>  
                        <hr />
                        <a href="#" className="text-red-400 hover:!bg-red-50 dark:hover:!bg-red-500/50"> <ion-icon className="text-xl" name="stop-circle-outline" />  Block </a>  
                        </nav>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        <div className="flex items-center justify-between  border-t border-gray-100 px-2 dark:border-slate-700" >
            <nav className="flex gap-0.5 rounded-xl overflow-hidden -mb-px text-gray-500 font-medium text-sm overflow-x-auto dark:text-white">
            <span href="#" id="1" onClick={() => HandleTab(1, setTab)} className={`inline-block py-3 leading-8 px-3.5 border-b-2 ${tab === 1 ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-500'}`}>Posts</span>
            <span href="#" id="3" onClick={() => HandleTab(3, setTab)}  className={`inline-block py-3 leading-8 px-3.5 border-b-2 ${tab === 3 ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-500'}`}>Events</span>
            <span href="#" id="4" onClick={() => HandleTab(4, setTab)}  className={`inline-block py-3 leading-8 px-3.5 border-b-2 ${tab === 4 ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-500'}`}>Members</span>
           { isowner ?  <span href="#" id="5" onClick={() => HandleTab(5, setTab)}  className={`inline-block py-3 leading-8 px-3.5 border-b-2 ${tab === 5 ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-500'}`}>Requests</span> : ""}
            </nav>
        </div> 
    </div>

    ) 
}

const HandleTab = (id, setTab) => {
    setTab(id)
}
