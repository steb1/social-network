import AddStory from "../components/addStory";
import { PostPlaceholder, AllPostText } from "../components/posts";
import { Rightbar } from "../components/rightbar";
import "../../public/js/script.js";
import "../../public/js/simplebar.js";
import Layout from "../components/Layout";
import authMiddleware from "@/middleware/authMiddleware";
import config from "@/config";

const HomePage = () => {
    return (
        <Layout>
            <div className='flex mt-5'>
                <div className='flex-1 pt-8 px-5  xl:space-y-6 space-y-3 lg:ml-80'>
                    {/* Add Story Section */}
                    <AddStory />
                    {/* Posts Section */}
                    <AllPostText />
                    <PostPlaceholder />

                </div>
                {/* Fixed Rightbar */}
                <div className='block h-full mt-20 ml-20 max-sm:hidden max-xl:hidden max-lg:hidden max-md:hidden'>
                    <Rightbar />
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
