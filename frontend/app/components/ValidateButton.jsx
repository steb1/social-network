const ValidateButton = ({ userId, cookie }) => {
  const [followStatus, setFollowStatus] = useState(FollowStatus);
  //const [showAlert, setShowAlert] = useState(false);
  const follow = async () => {
    try {
      const response = await fetch(`${config.serverApiUrl}`, {
        method: "POST",
        cache: "no-cache",
        headers: {
          Authorization: `${cookie}`,
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.type === "Followed") {
          setFollowStatus("Unfollow");
        }
        if (data.type === "Unfollow") {
          setFollowStatus("Follow");
        }
        if (data.type === "Pending") {
          setFollowStatus("Pending");
        }
      } else {
        const errorText = await response.text();
        console.error("Profile not changed successfully:", errorText);
      }
    } catch (error) {
      console.error("Error during changing profile privacy:", error);
    }
  };
  return (
    <button className="btn btn-circle bg-slate-300 hover:bg-green-700 btn-xs sm:btn-sm md:btn-md lg:btn-md text-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 48 48"
      >
        <path
          fill="#ffffff"
          fillRule="evenodd"
          stroke="fffffff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
          d="m4 24l5-5l10 10L39 9l5 5l-25 25z"
          clipRule="evenodd"
        ></path>
      </svg>
    </button>
  );
};
