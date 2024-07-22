import React from "react";

const DateMessage = ({ Content }) => {
    return (
        <div className='flex justify-center '>
            <div className='font-medium text-gray-500 text-sm dark:text-white/70'>{Content}</div>
        </div>
    );
};

export default DateMessage;
