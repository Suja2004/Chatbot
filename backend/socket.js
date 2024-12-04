const { Server } = require("socket.io");

const setupSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        // console.log("New connection");

        socket.on("joinRoom", ({ room, username }) => {
            socket.join(room);
            socket.to(room).emit("message", { sender: "System", text: `${username} has joined the room.` });
        });

        socket.on("chatMessage", ({ room, message }) => {
            io.to(room).emit("message", message);
        });

        socket.on("leaveRoom", (room) => {
            socket.leave(room);
        });

        socket.on("disconnect", () => {
            // console.log("User disconnected");
        });
    });


    return io;
};

module.exports = setupSocket;
