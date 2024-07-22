import React from "react";
import "../../public/assets/css/typing.css";
import config from "@/config";

const TypingIndicator = ({ Avatar }) => {
    return (
        <div id='indicator' className='flex gap-3 items-end'>
            <img src={`${config.ServerApiImage}${Avatar}`} alt='' className='w-9 h-9 rounded-full shadow' />
            <div className='px-4 py-2 rounded-[20px] max-w-sm '>
                <div className='typing-indicator'>
                    <div className='three col'>
                        <div className='loader' id='loader-2'>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;
