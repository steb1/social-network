import "../../public/js/script.js";
import "../../public/js/simplebar.js";
import PrivateAccountUI from "./privateaccount.jsx";
import Link from "next/link";
import ButtonTogglePrivacy from "./buttonTogglePrivacy.jsx";
import { cookies } from "next/headers";
import SeeFollowersFollowees from "./SeeFollowersFollowees.jsx";
import NoPostUI from "./NoPostUI.jsx";
import FollowButton from "./FollowButton.jsx";
import { PostText } from "./PostText.jsx";
import config from "@/config.js";

const MainProfile = ({ props, Visibility, FollowStatus }) => {
  const cookieStore = cookies();
  return (
    <div className="2xl:ml-[--w-side]  xl:ml-[--w-side-sm] p-2.5 h-0 mt-0">
      <div className="max-w-[1065px] mx-auto max-lg:-m-2.5">
        <div className="bg-white shadow lg:rounded-b-2xl lg:-mt-10 dark:bg-dark2">
          <div className="relative overflow-hidden w-full lg:h-72 h-48">
            <img
              src={`${config.ServerApiImage}${props.avatar}`}
              alt=""
              className="h-full w-full object-cover inset-0"
            />

            <div className="w-full bottom-0 absolute left-0 bg-gradient-to-t from-black/60 pt-20 z-10"></div>
          </div>

          <div className="p-3">
            <div className="flex flex-col justify-center md:items-center lg:-mt-48 -mt-28">
              <div className="relative lg:h-48 lg:w-48 w-28 h-28 mb-4 z-10">
                <div className="relative overflow-hidden rounded-full md:border-[6px] border-gray-100 shrink-0 dark:border-slate-900 shadow">
                  <img
                    src={`${config.ServerApiImage}${props.avatar}`}
                    alt=""
                    className="w-full object-cover inset-0"
                  />
                </div>
              </div>

              <h3 className="md:text-3xl text-base font-bold text-black dark:text-white">{`${props.firstName?.charAt(0).toUpperCase() + props.firstName?.slice(1)} ${props.lastName?.toUpperCase()}`}</h3>

              <p className="mt-2 text-gray-500 dark:text-white/80">
                {props.nickname
                  ? `@${props.nickname} / ${props.email}`
                  : props.email}
              </p>

              <p className="mt-2 badge badge-secondary">{`🎂 ${formatDateString(props.dateOfBirth)} 🥳`}</p>

              <p className="mt-2 max-w-xl text-sm md:font-normal font-light text-center">
                {props.aboutMe}
              </p>
            </div>
          </div>

          <div
            className="flex items-center justify-between mt-3 border-t border-gray-100 px-2 max-lg:flex-col dark:border-slate-700"
            uk-sticky="offset:50; cls-active: bg-white/80 shadow rounded-b-2xl z-50 backdrop-blur-xl dark:!bg-slate-700/80; animation:uk-animation-slide-top ; media: 992"
          >
            {props.id_requester == props.user_id ? (
              <div className="flex items-center gap-2 text-sm py-2 pr-1 max-md:w-full lg:order-2">
                <ButtonTogglePrivacy
                  accountType={props.accountType}
                  cookie={cookieStore.get("social-network").value}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm py-2 pr-1 max-md:w-full lg:order-2">
                <FollowButton
                  userId={props.user_id}
                  cookie={cookieStore.get("social-network").value}
                  FollowStatus={FollowStatus}
                />
                <button className="button bg-primary flex items-center gap-2 text-white py-2 px-3.5 max-md:flex-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M2 22V9q0-.825.588-1.413Q3.175 7 4 7h2V4q0-.825.588-1.413Q7.175 2 8 2h12q.825 0 1.413.587Q22 3.175 22 4v8q0 .825-.587 1.412Q20.825 14 20 14h-2v3q0 .825-.587 1.413Q16.825 19 16 19H5Zm6-10h8V9H8Zm-4 5h12v-3H8q-.825 0-1.412-.588Q6 12.825 6 12V9H4Zm14-5h2V4H8v3h8q.825 0 1.413.587Q18 8.175 18 9Z"
                    />
                  </svg>
                  <span className="text-sm"> Contact </span>
                </button>
              </div>
            )}

            <nav className="flex gap-0.5 rounded-xl -mb-px text-gray-600 font-medium text-[15px]  dark:text-white max-md:w-full max-md:overflow-x-auto">
              <div className="inline-block  py-3 leading-8 px-3.5 cursor-text">
                Posts{" "}
                <span className="text-black text-sm pl-2 font-bold lg:inline-block hidden">
                  {props.userPosts ? props.userPosts.length : 0}
                </span>
              </div>
              <div className="inline-block py-3 leading-8 px-3.5">
                <SeeFollowersFollowees
                  followersFollowees={props.followers}
                  visibility={Visibility}
                  text={"Follower(s)"}
                  modalId="followerModal"
                />
              </div>
              <div className="inline-block py-3 leading-8 px-3.5">
                <SeeFollowersFollowees
                  followersFollowees={props.followings}
                  visibility={Visibility}
                  text={"Following(s)"}
                  modalId="followingModal"
                />
              </div>
            </nav>
          </div>
        </div>

        <div
          className="flex 2xl:gap-12 gap-10 mt-8 max-lg:flex-col"
          id="js-oversized"
        >
          <div className="flex-1 xl:space-y-6 space-y-3">
            {Visibility === "Private" ? (
              <PrivateAccountUI />
            ) : (
              <>
                {!props.userPosts ? (
                  <NoPostUI />
                ) : (
                  <PostText posts={props.userPosts} />
                )}
              </>
            )}
          </div>

          {Visibility !== "Private" ? (
            <>
              <div className="lg:w-[400px]">
                <div
                  className="lg:space-y-4 lg:pb-8 max-lg:grid sm:grid-cols-2 max-lg:gap-6"
                  uk-sticky="media: 1024; end: #js-oversized; offset: 80"
                >
                  <div className="box p-5 px-6">
                    <div className="flex items-ce justify-between text-black dark:text-white">
                      <h3 className="font-bold text-lg">
                        Friends
                        <span className="block text-sm text-black mt-0. font-bold dark:text-white">
                          {props.followers ? props.followers.length : 0}
                        </span>
                      </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-2 gap-y-5 text-center text-sm mt-4 mb-2">
                      {props.followers &&
                        props.followers.slice(0, 6).map((follower) => (
                          <Link
                            href={`/profile/${follower.user_id}`}
                            key={follower.user_id}
                          >
                            <div>
                              <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                                <img
                                  src={`${config.ServerApiImage}${follower.avatar}`}
                                  alt=""
                                  className="object-cover w-full h-full inset-0"
                                />
                              </div>
                              <div className="mt-2 line-clamp-1">{`${follower.first_name} ${follower.last_name}`}</div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MainProfile;

function formatDateString(dateString) {
  const dateObject = new Date(dateString);
  const options = { month: "long", day: "numeric" };
  const formattedDate = dateObject.toLocaleDateString("en-US", options);
  return formattedDate;
}
