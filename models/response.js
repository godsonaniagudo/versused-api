const mongoose = require("mongoose")

const schema = mongoose.Schema({
    responderID : {
        type : "String",
        min : 6,
        required : true
    },
    responderRole  : {
        type : "String",
        required : true
    },
    video : {
        type : "String",
        required : true
    },
    duelID : {
        type : "String",
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    }
})

module.exports = mongoose.model("Response", schema)