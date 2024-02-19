"use client";

export const GroupOption = ({ group, setGroups, setServerError }) => {
    return (
        <div id={group.group_id} className='card card-compact bg-white-100 shadow-xl carousel-item w-96 h-64'>
            <figure>
                <img
                    src='https://i0.wp.com/www.iedunote.com/img/28051/reference-groups.jpg?fit=1080%2C720&quality=100&ssl=1'
                    alt='Shoes'
                />
            </figure>
            <div className='card-body'>
                <h2 className='card-title'>{group.title}</h2>
                <p>{group.description}</p>
                <div className='card-actions justify-end'>
                    <button
                        onClick={() => handleGroupRequest(group.group_id, setGroups, setServerError)}
                        className='btn btn-xs btn-primary '
                    >
                        Join
                    </button>
                </div>
            </div>
        </div>
    );
};

// async function handleGroupRequest(groupid, setGroups, setServerError) {
//     console.log("clicked");

//     let token = document.cookie.split("=")[1];

//     if (token) {
//         // Use the token as needed
//         console.log("Token:", token);
//     } else {
//         console.log("Token not found in cookies");
//     }

//     try {
//         const response = await fetch(config.serverApiUrl + "createMembership", {
//             method: "POST",
//             headers: {
//                 Authorization: token,
//             },
//             credentials: "include",
//             body: JSON.stringify({ groupid: groupid }),
//         });

//         if (response.ok) {
//             fetchAllGroups(setGroups, setServerError);
//         }
//     } catch (error) {
//         console.error("Error while fetching groups:", error);
//     }
// }

// Fonction pour afficher le pop-up
// function showPopup(username) {
//     document.getElementById("message-popup").style.display = "block";
//     document.getElementById("user").textContent = "Request sent";

//     // Afficher le bouton après 5 secondes (ajustable selon vos besoins)
//     setTimeout(function () {
//         document.getElementById("countdown").style.display = "none";
//         document.querySelector("button").style.display = "inline-block";
//     }, 5000);

//     // Disparition du pop-up après 8 secondes (ajustable selon vos besoins)
//     setTimeout(closePopup, 4000);
// }
