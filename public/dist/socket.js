const socket = io("http://localhost:5000");
let nameSpaceSocket;
function stringTOHTML(str) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(str, "text/html")
    return doc.body.firstChild
}
function initNameSpaceConnection(endpoint) {
    if (nameSpaceSocket) nameSpaceSocket.close();
    nameSpaceSocket = io(`http://localhost:5000/${endpoint}`);
    nameSpaceSocket.on("connect", () => {
        nameSpaceSocket.on("roomList", rooms => {
            getRoomInfo(endpoint, rooms[0]?.name)
            const roomsElement = document.querySelector("#contacts ul");
            roomsElement.innerHTML = ""
            for (const room of rooms) {
                const html = stringTOHTML(`
                <li class="contact" roomName = "${room.name}">
                    <div class="wrap">
                        <img src="${room.image}" height="40"/>
                        <div class="meta">
                            <p class="name">${room.name}</p>
                            <p class="preview">${room.description}</p>
                        </div>
                    </div>
                 </li>`)
                roomsElement.appendChild(html)
            }
            const roomNodes = document.querySelectorAll("ul li.contact")
            for (const room of roomNodes) {
                room.addEventListener("click", () => {
                    const roomName = room.getAttribute("roomName");
                    getRoomInfo(endpoint, roomName)
                })
            }
        })
    })
}
function getRoomInfo(endpoint, roomName) {
    document.querySelector("#roomName h3").setAttribute("roomName", roomName)
    document.querySelector("#roomName h3").setAttribute("endpoint", endpoint)
    nameSpaceSocket.emit("joinRoom", roomName)
    nameSpaceSocket.off("roomInfo")
    nameSpaceSocket.on("roomInfo", roomInfo => {
        document.querySelector(".messages ul").innerHTML = ""
        document.querySelector("#roomName h3").innerText = roomInfo.description
        const messages = roomInfo.messages;
        // const locations = roomInfo.locations;
        // const data = [...messages, ...locations].sort((con1, con2) => con1.dateTime - con2.dateTime)
        const userID = document.getElementById("userID").value;
        for (const message of messages) {
            const li = stringTOHTML(`
                <li class="${(userID == message.sender)? 'sent' : 'replies'}">
                    <img src="https://avatars.githubusercontent.com/u/116511190?v=4"
                        alt="" />
                    <p>${message.message}</p>
                </li>   
            `)
            document.querySelector(".messages ul").appendChild(li)
        }
    })
    nameSpaceSocket.on("countOfOnlineUsers", count => {
        document.getElementById("onlineCount").innerHTML = count
    })
}
function sendMessage (){
    const roomName = document.querySelector("#roomName h3").getAttribute("roomName")
    const endpoint = document.querySelector("#roomName h3").getAttribute("endpoint")
    let message = document.querySelector(".message-input input#messageInput").value;
    if(message.trim() == ""){
        return alert("input message can not be empty")
    }
    const userID = document.getElementById("userID").value;
    nameSpaceSocket.emit("newMessage", {
        message,
        roomName,
        endpoint,
        sender: userID
    })
    nameSpaceSocket.off("confirmMessage")
    nameSpaceSocket.on("confirmMessage", data => {
        const li = stringTOHTML(`
                <li class="${(userID == data.sender)? 'sent' : 'replies'}">
                    <img class="css-shadow" src="https://avatars.githubusercontent.com/u/116511190?v=4"
                        alt="" />
                    <p>${data.message}</p>
                </li>   
        `)
        document.querySelector(".messages ul").appendChild(li)
        document.querySelector(".message-input input#messageInput").value = ""
        const messagesElement = document.querySelector("div.messages");
        messagesElement.scrollTo(0, messagesElement.scrollHeight);
    })
}
socket.on("connect", () => {
    socket.on("nameSpaceList", nameSpacesList => {
        const nameSpaceElement = document.getElementById("namespaces");
        nameSpaceElement.innerHTML = ""
        initNameSpaceConnection(nameSpacesList[0].endpoint)
        for (const nameSpace of nameSpacesList) {
            const li = document.createElement("li");
            const p = document.createElement("p");
            p.setAttribute("class", "namespaceTitle")
            p.setAttribute("endpoint", nameSpace.endpoint)
            p.innerText = nameSpace.title;
            li.appendChild(p)
            nameSpaceElement.appendChild(li);
        }
        const nameSpaceNodes = document.querySelectorAll("#namespaces li p.namespaceTitle");
        for (const nameSpace of nameSpaceNodes) {
            nameSpace.addEventListener("click", () => {
                const endpoint = nameSpace.getAttribute("endpoint")
                initNameSpaceConnection(endpoint)
            })
        }
    });
    window.addEventListener("keydown", (e) => {
        if(e.code == "Enter"){
            sendMessage()
        }
    });
    document.querySelector("button.submit").addEventListener("click", () => {
        sendMessage()
    })
});
