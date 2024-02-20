import Header from "./header";
import Sidebar from "./sidebar";

export default function Layout({ children }) {
    return (
        <div id='wrapper'>
            <Header />
            <Sidebar />
            <main>{children}</main>
        </div>
    );
}
