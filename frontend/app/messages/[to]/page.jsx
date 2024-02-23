import authMiddleware from "@/middleware/authMiddleware";
import config from "@/config";
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import MainMessage from "@/app/components/mainMessage";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

const Messages = async ({ params: { to } }) => {
	const cookieStore = cookies();

	const response = await fetch(`${config.serverApiUrl}messageResponse?to=${to}`, {
		cache: "no-store",
		method: "GET",
		headers: {
			Authorization: cookieStore.get("social-network").value,
		},
	});

	if (!response.ok) {
		return notFound();
	}

	const { nickname_requester, avatar, followers, followings, groups, messages } = await response.json();

	const AbletoTalk =
		followers && followings
			? [...followings, ...followers].reduce((uniqueUsers, user) => {
					const existingUser = uniqueUsers.find((u) => u.user_id === user.user_id);
					if (!existingUser) {
						uniqueUsers.push(user);
					}
					return uniqueUsers;
				}, [])
			: followers || followings
				? followers || followings
				: null;

	const Chatter = AbletoTalk && AbletoTalk.filter((user) => user.nickname === to || user.email === to);
	const GroupChatter = groups && groups.filter((group) => group.GroupID == to);

	return (
		<div id="wrapper">
			<Header />
			<Sidebar />
			<MainMessage AbletoTalk={AbletoTalk} Chatter={Chatter} Sender={nickname_requester} AvatarSender={avatar} Groups={groups} GroupChatter={GroupChatter} Messages={messages} />
		</div>
	);
};

export default authMiddleware(Messages, `${config.serverApiUrl}checkAuth`);
