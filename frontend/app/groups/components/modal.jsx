import config from "@/config";
import { fetchGroupDetail } from "./groupDetail";

export const Modal = ( { groupId, setPosts , setGroup, setEvents, setRequests, setMessages, setServerError,  setIsOwner, setMembers, setInvites } ) => {
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const NewformData = new FormData(e.currentTarget);
    NewformData.append("groupId", groupId);
    let token = document.cookie.split("=")[1]
    const response = await fetch(config.serverApiUrl + "createGroupPost", {
      method: "POST",
      headers: {
        'Authorization': token,
      },
      body: NewformData,
    }); 
    try {
      const jsonData = await response.json();
      if (response.ok) {
        console.log("post sent");
        UIkit.modal("#create-status").hide();
        fetchGroupDetail(setPosts, setGroup, setEvents, setRequests, setMessages, setServerError, groupId, setIsOwner, setMembers, setInvites)
      }
    } catch (error) {
      console.error("Erreur lors de la lecture de la réponse JSON :", error);
    }
  };
    return (
        <div>            
        
        {/* post preview modal */} 
        <div className="hidden lg:p-20 max-lg:!items-start" id="preview_modal" uk-modal="">
            <div className="uk-modal-dialog tt relative mx-auto overflow-hidden shadow-xl rounded-lg lg:flex items-center ax-w-[86rem] w-full lg:h-[80vh]">
            {/* image previewer */}
            <div className="lg:h-full lg:w-[calc(100vw-400px)] w-full h-96 flex justify-center items-center relative">
                <div className="relative z-10 w-full h-full">
                <img src="../assets/images/post/post-1.jpg"  className="w-full h-full object-cover absolute" />
                </div>
                {/* close button */}
                <button type="button" className="bg-white rounded-full p-2 absolute right-0 top-0 m-3 uk-animation-slide-right-medium z-10 dark:bg-slate-600 uk-modal-close">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
            
            </div>
        </div>
        {/* create status */}
        <div className="hidden lg:p-20 uk- open closed" id="create-status" uk-modal="">
				<form id="create-Grouppost-form" encType="multipart/form-data" onSubmit={handleFormSubmit} action="">
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
							<textarea name="body" className="post_body w-full !text-black placeholder:!text-black !bg-white !border-transparent focus:!border-transparent focus:!ring-transparent !font-normal !text-xl   dark:!text-white dark:placeholder:!text-white dark:!bg-slate-800" rows={6} placeholder="What do you have in mind?" defaultValue={""} />
						</div>
						<div className="flex items-center gap-2 text-sm py-2 px-4 font-medium flex-wrap">
							<button type="button" className="flex items-center gap-1.5 bg-sky-50 text-sky-600 rounded-full py-1 px-2 border-2 border-sky-100 dark:bg-sky-950 dark:border-sky-900">
								<ion-icon name="image" className="text-base" />
								<input name="media_post" type="file" className="file-input file-input-bordered file-input-xs w-full max-w-xs" />
							</button>
							<div className="btn" onClick={() => document.getElementById("my_modal_1").showModal()}>
								Categories
							</div>
							<dialog id="my_modal_1" className="modal">
								<div className="modal-box w-[400px]">
									<div className="modal-action flex flex-col dark:border-slate-700">
										<div className="p-5 flex justify-between items-center">
											<input className="checkbox checkbox-info select_category" type="checkbox" name="category" id="Technology" value="Technology" />
											<label htmlFor="Technology">Technology</label>
											<input className="checkbox checkbox-info select_category" type="checkbox" name="category" id="Health" value="Health" />
											<label htmlFor="Health">Health</label>
											<input className="checkbox checkbox-info select_category" type="checkbox" name="category" id="Politic" value="Politics" />
											<label htmlFor="Politic">Politics</label>
										</div>
										<div className="p-5 flex justify-between items-center">
											<input className="checkbox checkbox-info select_category" type="checkbox" name="category" id="Sport" value="Sports" />
											<label htmlFor="Sport">Sports</label>
											<input className="checkbox checkbox-info select_category" type="checkbox" name="category" id="Religion" value="Religion" />
											<label htmlFor="Religion">Religion</label>
											<input className="checkbox checkbox-info select_category" type="checkbox" name="category" id="Other" value="Others" />
											<label htmlFor="Other">Others</label>
										</div>
										<form method="dialog">
											{/* if there is a button in form, it will close the modal */}
											<button className="btn">Close</button>
										</form>
									</div>
								</div>
							</dialog>
						</div>
						<div className="p-5 flex justify-between items-center">							
							<div className="flex items-center gap-2">
								<button type="submit" id="but" className="button bg-blue-500 text-white py-2 px-12 text-[14px]">
									{" "}
									Create
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
        {/* create event */}
        <div className="hidden lg:p-20 uk- open" id="create-event" uk-modal="">
            <div className="uk-modal-dialog tt relative overflow-hidden mx-auto bg-white shadow-xl rounded-lg md:w-[520px] w-full dark:bg-dark2">
            <div className="text-center py-4 border-b mb-0 dark:border-slate-700">
                <h2 className="text-sm font-medium text-black"> Create Event </h2>
                {/* close button */}
                <button type="button" className="button-icon absolute top-0 right-0 m-2.5 uk-modal-close">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
            <div className="space-y-5 mt-3 p-2">
                <label className="input  flex items-center gap-2">
                    Title
                    <input id="EventTitle" type="text" className=" w-56 mx-auto" placeholder="" />
                </label>    
                  
                <label className="input  flex items-center gap-2">
                    Date
                    <input id="EventDate" type="date" className="w-56 mx-auto" placeholder="" />
                </label>
                <label className="input  flex items-center gap-2">
                    Time
                    <input id="EventTime" type="time" className="w-56 mx-auto" placeholder="" />
                </label>
                <label className="input  flex items-center gap-2">
                    Description
                    <input id="DescriptionEvent" type="text" className="w-56 mx-auto" placeholder="" />
                </label>
                
            </div>
            <div className="p-5 flex justify-between items-center">
                <div className="flex items-center gap-2"> 
                <button type="button" id={groupId} onClick={(e) => handleCreateEvent(e, setPosts, setGroup, setEvents, setRequests, setMessages, setServerError)} className="button bg-blue-500 text-white py-2 px-12 text-[14px] uk-modal-close"> Create</button>
                </div>
            </div>
            </div>
        </div>

        </div>

    )
}


async function handleCreateEvent(e, setPosts, setGroup, setEvents, setRequests, setMessages, setServerError) {
    let  token = document.cookie.split("=")[1]
    if (!e.target.id) {
        return
    }

    let DescriptionEvent = document.getElementById("DescriptionEvent")
    let EventTime = document.getElementById("EventTime")
    let EventDate = document.getElementById("EventDate")
    let EventTitle = document.getElementById("EventTitle")

    const currentDate = new Date();
    const selectedDate = new Date(EventDate.value);




    if (!DescriptionEvent || !EventTime || !EventDate || !EventTitle || !DescriptionEvent.value.trim()  || !EventDate.value.trim() || !EventTitle.value.trim() || selectedDate < currentDate) {
        alert("Please fill the form properly");
        return
    }


    let groupId = e.target.id
    

    const formData = new FormData();
    formData.append("DescriptionEvent", DescriptionEvent.value);
    formData.append("EventTime", EventTime.value);
    formData.append("EventDate", EventDate.value);
    formData.append("EventTitle", EventTitle.value);
    formData.append("groupId", groupId);

      
      if (token) {
        // Use the token as needed
        console.log('Token:', token);
      } else {
        console.log('Token not found in cookies');
      }

      try {
        const response = await fetch(config.serverApiUrl + "createEvent", {
          method: "POST",
          headers: {
            'Authorization': token,
          },
          credentials: "include",
          body: formData,
        });
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            fetchGroupDetail(setPosts, setGroup, setEvents, setRequests, setMessages, setServerError, groupId)
          } else {
            console.error("Response is not in JSON format");
          }
        } else {
          const errorResponse = await response.json();
          const errorMessage = errorResponse.error || "An error occurred.";
          console.error("No Group retrieved:", errorMessage);
        }
      } catch (error) {
        console.error("Error while fetching groups:", error);
      }
}