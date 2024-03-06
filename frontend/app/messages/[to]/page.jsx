import AuthMiddleware from "@/middleware/authMiddleware";
import config from "@/config";
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import MainMessage from "@/app/components/MainMessage";
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

    const { nickname_requester, avatar, ableToTalk, messagesPreview, groups, messages } = await response.json();

    const Chatter = ableToTalk && ableToTalk.filter((user) => user.nickname === to || user.email === to);
    const GroupChatter = groups && groups.filter((group) => group.GroupID == to);

    return (
        <div id='wrapper'>
            <Header />
            <Sidebar />
            <MainMessage
                AbletoTalk={ableToTalk}
                MessagesPreview={messagesPreview}
                Chatter={Chatter}
                Sender={nickname_requester}
                AvatarSender={avatar}
                Groups={groups}
                GroupChatter={GroupChatter}
                Messages={messages}
            />
        </div>
    );
};

export default AuthMiddleware(Messages, config.serverApiUrl + "checkAuth");
