const mongoose = require("mongoose")

const schema = mongoose.Schema({
    type : {
       type : "String",
       required : true 
    },
    contentID : {
        type : "String",
        min : 6
    },
    senderDetails : {
        type : "Object"
    },
    recipient : {
        type : "String",
        min : 6
    },
    message : {
        type : "String",
        min : 6,
        required : true
    },
    operation : {
        type : "String"
    },
    date : {
        type : Date,
        default : Date.now()
    }
})

module.exports = mongoose.model("Notification" , schema)