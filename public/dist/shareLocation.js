function getLocation(){
    const roomName = document.querySelector("#roomName h3").getAttribute("roomName")
    const endpoint = document.querySelector("#roomName h3").getAttribute("endpoint")
    const userID = document.getElementById("userID").value;
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const {latitude: lat, longitude: long} = position.coords;
            const latlong = new google.maps.LatLng(lat, long)
            const myOptions = {
                center: latlong,
                zoom: 14,
                mapTypeId:  google.maps.MapTypeId.ROADMAP,
                mapTypeControl: true,
                navigationControlOptions: {
                    style:  google.maps.NavigationControlStyle.SMALL
                },
            }
            namespaceSocket.emit("newLocation", {
                location: myOptions,
                roomName,
                endpoint,
                sender: userID
            })
            namespaceSocket.off("confirmLocation")
            namespaceSocket.on("confirmLocation", data => {
                const li = stringToHTML(`
                <li class="${(userID == data.sender)? 'sent' : 'replies'}">
                    <img class="css-shadow" src="https://avatars.githubusercontent.com/u/116511190?v=4"
                        alt="" />
                </li>   
                `)
                const p = stringToHTML(`<p id="location-me" style="width: 200px; height:150px;"></p>`)
                const map = new google.maps.Map(p, data.location)
                li.appendChild(p)
                document.querySelector(".messages ul").appendChild(li)
                new google.maps.Marker({
                    position: data.location.center,
                    map,
                    title: "You are here"
                })
                const messagesElement = document.querySelector("div.messages");
                messagesElement.scrollTo(0, messagesElement.scrollHeight);
            })
        }, 
        (error) => {
            const li = stringToHTML(`
            <li class="${(userID == data.sender)? 'sent' : 'replies'}">
                <img class="css-shadow" src="https://avatars.githubusercontent.com/u/116511190?v=4"
                    alt="" />
            </li>   
            `)
            const p = stringToHTML(`<p id="location-me" style="width: 200px; height:150px;">${error.message}</p>`)
            li.appendChild(p)
            document.querySelector(".messages ul").appendChild(li)
        })
}