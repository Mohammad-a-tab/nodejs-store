const { ConversationModel } = require("../models/conversation");
module. exports = class NameSpaceSocketHandler {
    #io;
    constructor(io){
        this.#io = io
    }
    initConnection() {
        this.#io.on("connection", async socket => {
            const nameSpaces = await ConversationModel.find({}, {
                title : 1,
                endpoint : 1,
                rooms : 1
            }).sort({_id : -1});
            socket.emit("nameSpaceList", nameSpaces)
        })
    }
    async createNameSpaceConnection() {
        const nameSpaces = await ConversationModel.find({}, {
            title : 1,
            endpoint : 1,
            rooms : 1
        }).sort({_id : -1});
        for (const nameSpace of nameSpaces) {
            this.#io.of(`/${nameSpace.endpoint}`).on("connection", async socket => {
                const conversation = await ConversationModel.findOne({endpoint : nameSpace.endpoint} , {
                    endpoint : 1,
                    rooms : 1
                }).sort({_id : -1});
                socket.emit("roomList", conversation.rooms)
                socket.on("joinRoom", async roomName => {
                    const lastRoom = Array.from(socket.rooms)[1]
                    if(lastRoom) {
                        socket.leave(lastRoom)
                        await this.getCountOfOnlineUsers(nameSpace.endpoint, roomName)
                    }
                    socket.join(roomName);
                    await this.getCountOfOnlineUsers(nameSpace.endpoint, roomName)
                    const roomInfo = conversation.rooms.find(item => item.name == roomName)
                    socket.emit("roomInfo", roomInfo);
                    this.getNewMessage(socket)
                    socket.on("disconnect", async () => {
                        await this.getCountOfOnlineUsers(nameSpace.endpoint, roomName)
                    })
                })
            })
        }
    }
    async getCountOfOnlineUsers(endpoint, roomName) {
        const onlineUsers = await this.#io.of(`/${endpoint}`).in(roomName).allSockets()
        this.#io.of(`/${endpoint}`).in(roomName).emit("countOfOnlineUsers", Array.from(onlineUsers).length)
    }
    getNewMessage(socket) {
        socket.on("newMessage", async data => {
            const {message, roomName, endpoint, sender} = data;
            await ConversationModel.updateOne({endpoint, "rooms.name" : roomName}, {
                $push : {
                  "rooms.$.messages" : {
                        message,
                        sender : "636ab4a0bf1a099aca67c3b2",
                        dateTime : Date.now()

                  }
                }
            })
        })
    }
}