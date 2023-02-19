function getLocation (){
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const {latitude: lat, longitude: long} = position.coords;
        },
        (error) => {

        }
    )
}