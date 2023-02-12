const socket = io("http://localhost:5000");
let nameSpaceSocket;
function stringTOHTML(str) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(str, "text/html")
    return doc.body.firstChild
}
function initNameSpaceConnection(endpoint) {
    nameSpaceSocket = io(`http://localhost:5000/${endpoint}`);
    nameSpaceSocket.on("connect", () => {
        nameSpaceSocket.on("roomList", rooms => {
            getRoomInfo(rooms[0]?.name)
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
                    getRoomInfo(roomName)
                })
            }
        })
    })
}
function getRoomInfo(roomName) {
    nameSpaceSocket.emit("joinRoom", roomName)
    nameSpaceSocket.off("roomInfo")
    nameSpaceSocket.on("roomInfo", roomInfo => {
        document.querySelector("#roomName h3").innerText = roomInfo.description
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

})