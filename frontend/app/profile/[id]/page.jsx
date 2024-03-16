import React from "react";
import config from "@/config";
import MainProfile from "../../components/mainProfile";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Layout from "../../components/Layout";
import AuthMiddleware from "@/middleware/authMiddleware";

const Profile = async ({ params: { id } }) => {
  const cookieStore = cookies();
  let profileData = null;

  try {
    const response = await fetch(`${config.serverApiUrl}profile?id=${id}`, {
      cache: "no-cache",
      method: "GET",
      headers: {
        Authorization: cookieStore.get("social-network").value,
      },
    });

    if (response.ok) {
      profileData = await response.json();
      console.log(profileData);
    } else {
      return notFound();
    }
  } catch {
    return notFound();
  }

  let Visibility = "";

  if (profileData.accountType === "Private") {
    Visibility =
      profileData.id_requester == profileData.user_id
        ? "Public"
        : // if followers array exists and is not null
          profileData.followers &&
            Array.isArray(profileData.followers) &&
            profileData.followers.length > 0
          ? profileData.followers.some(
              (follower) => follower.user_id == profileData.id_requester
            )
            ? "Public"
            : "Private"
          : "Private";
  }
  //TODO : When the request is pending
  return (
    <Layout>
      <MainProfile
        props={profileData}
        Visibility={Visibility}
        FollowStatus={profileData.followStatus}
      />
    </Layout>
  );
};

export default AuthMiddleware(Profile, config.serverApiUrl + "checkAuth");
