const mongoose = require("mongoose")

const schema = mongoose.Schema({
    duelID : {
        type : "String",
        min : 6,
        required : true
    },
    sender : {
        type : "String",
        min : 6,
        required : true
    },
    recipient : {
        type : "String",
        min : 6,
        required : true 
    },
    senderDetails : {
        type : "Object",
        required : true
    },
    recipientDetails : {
        type : "Object",
        required : true
    },
    duelTitle : {
        type : "String",
        min : 4,
        required : true
    },
    coverPicture : {
        type : "String",
        default  :""
    },
    date : {
        type : Date,
        default : Date.now()
    }

})

module.exports = mongoose.model("DuelRequests" , schema)