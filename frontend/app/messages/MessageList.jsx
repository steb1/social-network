// "use client";
// import React, { useEffect, useState } from "react";
// import RightMessage from "./RightMessage";
// import LeftMessage from "./LeftMessage";

// const MessageList = ({ Messages, Avatar, Chatter, Sender }) => {
//     const [messages, setMessages] = useState([]);
//     useEffect(() => {
//         // Update the local state when the prop changes
//         console.log(Avatar);
//         console.log(Chatter);
//         console.log(Sender);
//         // console.log(Mesages);
//         setMessages(Messages);
//     }, [Messages]);

//     // <div id='cms' ref={cmsRef} className='text-sm font-medium space-y-6'></div>
//     return (
//         <>
//             {messages && messages.length > 0 ? (
//                 <div id='cms' className='text-sm font-medium space-y-6'>
//                     {messages.map((message) => {
//                         if (message.sender === Sender) {
//                             <RightMessage Avatar={Avatar} Content={message.content} />;
//                             console.log(message.content);
//                         } else {
//                             console.log(message.sender);
//                             console.log(Sender);
//                             console.log(message.receiver);
//                             <LeftMessage Avatar={Avatar} Content={message.content} />;
//                         }
//                     })}
//                 </div>
//             ) : (
//                 <div className='flex gap-2 flex-row-reverse items-end'>
//                     <img src={`${config.ServerApiImage}${Avatar}`} alt='' className='w-5 h-5 rounded-full shadow' />
//                     <div className='px-4 py-2 rounded-[20px] max-w-sm bg-gradient-to-tr from-sky-500 to-blue-500 text-white shadow'>
//                         <pre> Hello mathafucka </pre>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default MessageList;
