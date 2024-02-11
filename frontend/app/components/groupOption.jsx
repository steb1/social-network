import config from "@/config";

export const GroupOption = ( {group} ) => {

    return (
        <div id={group.group_id} className="card card-compact w-36 bg-base-100 shadow-xl">
            <figure><img src="https://i0.wp.com/www.iedunote.com/img/28051/reference-groups.jpg?fit=1080%2C720&quality=100&ssl=1" alt="Shoes" /></figure>
            <div className="card-body">
                <h2 className="card-title">{group.title}</h2>
                <p>{group.description}</p>
                <div className="card-actions justify-end">
                <button onClick={() => handleGroupRequest(group.group_id)} className="btn btn-primary">Join</button>
                </div>
            </div>
        </div>
    )
}

async function  handleGroupRequest  (groupid) {
    console.log("clicked");
    let  token = document.cookie.split("=")[1]
      
    if (token) {
      // Use the token as needed
      console.log('Token:', token);
    } else {
      console.log('Token not found in cookies');
    }

    try {
      const response = await fetch(config.serverApiUrl + "createMembership", {
        method: "POST",
        headers: {
          'Authorization': token,
        },
        credentials: "include",
        body: JSON.stringify({ groupid: groupid })
      });

      if (response.ok) {
        console.log("ooooooooook");
      }
    } catch (error) {
        console.error("Error while fetching groups:", error);
      }
}



