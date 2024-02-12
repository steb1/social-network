import Header from "../components/header";
import Sidebar from "../components/sidebar";
import { Discussion } from "../components/discussion";
import { MessageContent } from "../components/message";
import { Userinfo } from "../components/userinfo";

const Message = () => {
    return (
    <div className="overflow-y-hidden">
         <div>
        <Header/>
         </div>
        <div className=" flex flex-row">
        <div className="mt-16"> 
            <Sidebar/>
        </div>
        <div id="site__main" className=" w-full p-2.5 h-[calc(100vh-var(--m-top))] mt-[--m-top]">
                <div className=" overflow-hidden  border -m-2.5 dark:border-slate-700">
                    <div className="flex  w-full bg-white dark:bg-dark2">
                        <Discussion/>
                        < MessageContent />
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Message