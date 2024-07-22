import config from "@/config";
import { clearConfigCache } from "prettier";

export const fetchMessages = async (
    to,
    setMessages,
    setMessagesPreviews,
    setGroups,
    setSender,
    setAvatarsender,
    setAbletoTalk,
    setChatter,
    setGroupChatter,
    lastJsonMessage,
    chatter,
    groupChatterID
) => {
    let token = document.cookie.split("=")[1];

    const response = await fetch(`${config.serverApiUrl}messageResponse?to=${to.to}`, {
        cache: "no-cache",
        method: "GET",
        headers: {
            Authorization: token,
        },
    });

    if (response.ok) {
        const { nickname_requester, avatar, ableToTalk, messagesPreview, groups, messages, User } =
            await response.json();

        const Chatter = ableToTalk && ableToTalk.filter((user) => user.nickname === to || user.email === to);
        const GroupChatter = groups && groups.filter((group) => group.GroupID == groupChatterID);

        setAbletoTalk(ableToTalk);
        if (lastJsonMessage) {
            if (lastJsonMessage.command === "messageforuser") {
                if (
                    chatter[0]?.nickname == lastJsonMessage.body.sender ||
                    chatter[0]?.email == lastJsonMessage.body.sender
                ) {
                    setMessages(messages);
                }
            }
        }
        setAvatarsender(avatar);
        setGroups(groups);
        setSender(nickname_requester);
        setMessagesPreviews(messagesPreview);
        if (setChatter) {
            setChatter(User);
        }
        if (setGroupChatter) {
            setGroupChatter(GroupChatter);
        }
    }
};
