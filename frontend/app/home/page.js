import Header from "../components/header";
import Sidebar from "../components/sidebar";
import AddStory from "../components/addStory";
import { PostImage, PostText, PostImageSlider, PostPlaceholder } from "../components/posts";
import { Modal } from "../components/modal";
import { Rightbar } from "../components/rightbar";
import "../../public/assets/js/script.js";
import "../../public/assets/js/simplebar.js";

const HomePage = () => {

 
  return (
    <div id="wrapper" className="pt-15 space-x-2">
      {/* Header */}
      <Header />

      <div className="flex mt-5">
        {/* Fixed Sidebar */}
        <div className="fixed mt-2 h-auto left-0 top-12 max-sm:hidden max-md:hidden max-lg:hidden  overflow-y-visible touch-none h-full">
          <Sidebar />
        </div>

        <div className="flex-1 pt-8 px-5 md:max-w-[580px] xl:space-y-6 space-y-3 ml-80 ">
          {/* Add Story Section */}
          <Modal />
          <AddStory />

          {/* Posts Section */}
          <PostImage/>
          <PostImageSlider />
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
