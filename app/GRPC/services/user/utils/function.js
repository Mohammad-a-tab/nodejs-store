function deleteEmptyKeys(obj) {
    for (let key in obj) {
      if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
        delete obj[key];
      }
    }
}

module.exports = {
    deleteEmptyKeys
}
