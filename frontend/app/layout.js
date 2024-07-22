import { Inter } from "next/font/google";
import "./globals.css";
import "../public/assets/css/style.css";
import "../public/assets/css/tailwind.css";
import "../src/style.css";
import "../public/js/script.js";
import "../public/js/simplebar.js";
import "../public/js/uikit.min.js";
import "../public/js/socket.js";
import { WebSocketProvider } from "@/public/js/websocketContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Social network",
    description: "The social network for 01",
};

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <head>
                <script src='/js/uikit.min.js'></script>
                <script src='/js/simplebar.js'></script>
                <script src='/js/script.js'></script>
                <script src='/js/socket.js'></script>
                {/* <!-- Ion icon --> */}
                <script noModule src='https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js'></script>
                <script type='module' src='https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js'></script>
            </head>
            <WebSocketProvider>
                <body className={inter.className}>{children}</body>
            </WebSocketProvider>
        </html>
    );
}
