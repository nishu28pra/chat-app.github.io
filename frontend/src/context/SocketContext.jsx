
import { createContext, useEffect, useState, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
            console.log("Connecting to socket with userId:", authUser._id);

            const socket = io("https://live-chat-app-qhfc.onrender.com", {
                query: {
                    userId: authUser._id,
                },
            });

            setSocket(socket);

            socket.on("connect", () => {
                console.log("Socket connected:", socket.id);
            });

            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            socket.on("connect_error", (err) => {
                console.error("Socket connection error:", err);
            });

            return () => {
                console.log("Closing socket...");
                socket.close();
            };
        } else {
            if (socket) {
                console.log("No authUser, closing socket...");
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
