import Header from "../components/header";
import Sidebar from "../components/sidebar";
import AddStory from "../components/addStory";
import { PostText, PostPlaceholder } from "../components/posts";
import { Rightbar } from "../components/rightbar";
import "../../public/js/script.js";
import "../../public/js/simplebar.js";

const HomePage = () => {
	return (
		<div id="wrapper">
			{/* Header */}
			<Header />
			<Sidebar />
			<div className="flex mt-5">
				<div className="flex-1 pt-8 px-5 md:max-w-[580px] xl:space-y-6 space-y-3 ml-80 ">
					{/* Add Story Section */}
					<AddStory />
					{/* Posts Section */}
					<PostText />
					<PostPlaceholder />
					{/* Modal */}
				</div>
				{/* Fixed Rightbar */}
				<div className="block h-full mt-20 ml-20 max-sm:hidden max-md:hidden max-lg:hidden ">
					<Rightbar />
				</div>
			</div>
		</div>
	);
};

export default HomePage;
