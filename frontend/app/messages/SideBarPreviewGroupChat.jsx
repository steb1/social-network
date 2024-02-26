import React from "react";
import Link from "next/link";

const SideBarPreviewGroupChat = ({ ID, GroupName, Users }) => {
	const displayedUsers = Users.slice(0, 3);
	const remainingUsersCount = Users.length - displayedUsers.length;

	return (
		<Link href={`/messages/${ID}`} className="relative flex items-center gap-4 p-2 duration-200 rounded-xl hover:bg-secondery">
			<div className="avatar-group -space-x-6 rtl:space-x-reverse">
				{displayedUsers.map((user, index) => (
					<div key={index} className="avatar">
						<div className="w-12">
							<img src={`http://localhost:8080/img/${user.Avatar}`} alt={`User ${index + 1}`} />
						</div>
					</div>
				))}
				{remainingUsersCount > 0 && (
					<div key="placeholder" className="avatar placeholder">
						<div className="w-12 bg-neutral text-neutral-content">
							<span>+{remainingUsersCount}</span>
						</div>
					</div>
				)}
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 mb-1.5">
					<div className="mr-auto text-sm text-black dark:text-white font-medium">{GroupName}</div>
				</div>
			</div>
		</Link>
	);
};

export default SideBarPreviewGroupChat;
