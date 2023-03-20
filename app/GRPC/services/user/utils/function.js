function checkEmpty(data) {
    Object.keys(data).forEach(key => {
        if(data[key] == undefined || null || "") delete data[key];
    })
}
module.exports = {
    checkEmpty
}