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
                    console.log(roomName);
                })
            })
        }
    }
}