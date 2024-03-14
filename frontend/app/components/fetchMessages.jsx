import config from "@/config";

export const fetchMessages = async (
    to,
    setMessages,
    setMessagesPreviews,
    setGroups,
    setSender,
    setAvatarsender,
    setAbletoTalk,
    setChatter,
    setGroupChatter
) => {
    let token = document.cookie.split("=")[1];
    console.log(to.to, "(((((((((((à============))))");

    const response = await fetch(`${config.serverApiUrl}messageResponse?to=${to.to}`, {
        cache: "no-cache",
        method: "GET",
        headers: {
            Authorization: token,
        },
    });

    if (response.ok) {
        console.log("---------uuuuuuuuuuuuuuuu----------------");

        const { nickname_requester, avatar, ableToTalk, messagesPreview, groups, messages, User } =
            await response.json();

        const Chatter = ableToTalk && ableToTalk.filter((user) => user.nickname === to || user.email === to);
        const GroupChatter = groups && groups.filter((group) => group.GroupID == to);

        console.log(ableToTalk, "------------ableToTalk", " ------ to", to);
        console.log(Chatter, "------------Chatter");
        console.log(messages, "------------messagesPreview");

        setAbletoTalk(ableToTalk);
        setMessages("");
        setMessages(messages);
        setAvatarsender(avatar);
        setGroups(groups);
        setSender(nickname_requester);
        setMessagesPreviews(messagesPreview);
        if (setChatter) {
            setChatter(User);
            console.log("Messages Respones --- Chatter", User);
        }
        if (setGroupChatter) {
            setGroupChatter(GroupChatter);
            console.log("Messages Respones --- Group Chatter", GroupChatter);
        }
    } else {
        console.log("---------okokokoo----------------");
    }
};
