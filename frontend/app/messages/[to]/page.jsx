import AuthMiddleware from "@/middleware/authMiddleware";
import config from "@/config";
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import MainMessage from "@/app/components/MainMessage";


    const Messages = async ({ params: { to } }) => {
  
    return (
        <div id='wrapper'>
            <Header />
            <Sidebar />
            <MainMessage
                to={to}
            />
        </div>
    );
};

export default AuthMiddleware(Messages, config.serverApiUrl + "checkAuth");
