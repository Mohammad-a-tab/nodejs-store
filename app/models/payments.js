const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema({

});

module.exports = {
    PaymentModel :  mongoose.model("payment", Schema) 
}