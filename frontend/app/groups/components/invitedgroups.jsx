import config from "@/config";
import { fetchAllGroups } from "./displayGroups";

export const GroupInvited = ({
    group,
    setPublicGroups,
    setOwnGroups,
    setServerError,
    setSubcribedGroups,
    setInvitedgroups,
}) => {
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
                <div id='tohide' className='card-actions justify-end'>
                    <button
                        onClick={(e) =>
                            handleInvationResponse(
                                e,
                                group.group_id,
                                setPublicGroups,
                                setOwnGroups,
                                setServerError,
                                setSubcribedGroups,
                                setInvitedgroups,
                                "accept"
                            )
                        }
                        className='btn btn-xs bg-lime-500 text-white font-light hover:bg-line-700'
                    >
                        Accept
                    </button>
                    <button
                        onClick={(e) =>
                            handleInvationResponse(
                                e,
                                group.group_id,
                                setPublicGroups,
                                setOwnGroups,
                                setServerError,
                                setSubcribedGroups,
                                setInvitedgroups,
                                "refuse"
                            )
                        }
                        className='btn btn-xs bg-red-600 text-white font-light hover:bg-white-700'
                    >
                        Refuse
                    </button>
                </div>
            </div>
        </div>
    );
};

async function handleInvationResponse(
    e,
    groupId,
    setPublicGroups,
    setOwnGroups,
    setServerError,
    setSubcribedGroups,
    setInvitedgroups,
    option
) {
    let token = document.cookie.split("=")[1];
    if (!token) {
        return;
    }

    const formData = new FormData();
    formData.append("groupId", groupId);
    formData.append("option", option);

    try {
        const response = await fetch(config.serverApiUrl + "handleInvitation", {
            method: "POST",
            cache: "no-cache",
            headers: {
                Authorization: token,
            },
            credentials: "include",
            body: formData,
        });

        if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                fetchAllGroups(setPublicGroups, setOwnGroups, setServerError, setSubcribedGroups, setInvitedgroups);
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
