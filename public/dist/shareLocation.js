function getLocation (){
    const roomName = document.querySelector("#roomName h3").getAttribute("roomName")
    const endpoint = document.querySelector("#roomName h3").getAttribute("endpoint")
    const userID = document.getElementById("userID").value;
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const {latitude: lat, longitude: long} = position.coords;
            const latLong = new google.maps.latLng(lat, long);
            const li = stringToHTML(`
            <li class="sent">
                <img class="css-shadow" src="https://avatars.githubusercontent.com/u/116511190?v=4"
                    alt="" />
            </li>   
            `)
            const myOptions = {
                center: latLong,
                zoom: 14,
                mapTypeId:  google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                navigationControlOptions: {
                    style:  google.maps.NavigationControlStyle.SMALL
                },
            }
            const p = stringToHTML('<p id="location-me" style="width: 200px; height:150px;"></p>')
            const map = new google.maps.Map(p, myOptions)
            li.appendChild(p)
            document.querySelector('.messages ul').appendChild(li)
        },
        (error) => {
            const li = stringToHTML(`
            <li class="sent">
                <img class="css-shadow" src="https://avatars.githubusercontent.com/u/116511190?v=4"
                    alt="" />
            </li>   
            `)
            const p = stringToHTML(`<p id="location-me" style="width: 200px; height:150px;">${error.message}</p>`)
            li.appendChild(p)
            document.querySelector(".messages ul").appendChild(li)
        }
    )
}