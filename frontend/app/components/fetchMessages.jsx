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
  console.log(to.to, "(((((((((((à============))))");

  const response = await fetch(
    `${config.serverApiUrl}messageResponse?to=${to.to}`,
    {
      cache: "no-cache",
      method: "GET",
      headers: {
        Authorization: token,
      },
    }
  );

  if (response.ok) {
    console.log("---------uuuuuuuuuuuuuuuu----------------");

    const {
      nickname_requester,
      avatar,
      ableToTalk,
      messagesPreview,
      groups,
      messages,
      User,
    } = await response.json();

    const Chatter =
      ableToTalk &&
      ableToTalk.filter((user) => user.nickname === to || user.email === to);
    console.log(groups, "----------------------------------------groups");
    const GroupChatter =
      groups && groups.filter((group) => group.GroupID == groupChatterID);
    console.log(
      lastJsonMessage,
      "----------------------------lastJsonMessageeeeeeeuh"
    );

    setAbletoTalk(ableToTalk);
    if (lastJsonMessage) {
      console.log("GUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU", chatter);
      if (lastJsonMessage.command === "messageforuser") {
        if (
          chatter[0]?.nickname == lastJsonMessage.body.sender ||
          chatter[0]?.email == lastJsonMessage.body.sender
        ) {
          console.log("REFRESHHHH MESSSAGE CHACAL");
          setMessages(messages);
          setAvatarsender(avatar);
        }
      }
      if (lastJsonMessage.command === "messageforgroup") {
        console.log("MESSSS GROUPPP", GroupChatter);
      }
    }
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
