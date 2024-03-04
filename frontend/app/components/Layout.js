// WebSocketContext.js
import Header from "./header";
import Sidebar from "./sidebar";
import { WebSocketProvider } from "@/public/js/websocketContext";

export default function Layout({ children }) {        
    return (
        <div id='wrapper'>
            <WebSocketProvider>
                <Header />
                <Sidebar />
                {children}
            </WebSocketProvider>
        </div>
    );
}
