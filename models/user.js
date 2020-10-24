const mongoose = require("mongoose")

const schema = mongoose.Schema({
    name : {
        type : "String",
        min  : 3,
        max : 1024,
        required : true
    },
    alias : {
        type : "String",
        min  : 3,
        max : 1024,
        required : true
    },
    email :  {
        type : "String",
        min  : 3,
        max : 1024,
        required : true
    },
    password : {
        type : "String",
        min  : 6,
        max : 1024,
        required : true
    },
    verificationString : {
        type : "String",
        min  : 6,
        max : 1024,
       default : ""
    },
    resetString : {
        type : "String",
        min  : 6,
        max : 1024,
       default : ""
    },
    
    profilePic : {
        type : "String",
        min  : 6,
        max : 1024,
        default : "https://res.cloudinary.com/codefroyo/image/upload/v1600000271/Project%20Icons/iconfinder-icon_4_wqgidm.svg"
    },
    accountStatus : {
        type : "String",
        default : "inactive"
    },
    categories : [String],
    wins : {
        type : "Number",
        default : 0
    },
    losses : {
        type : "Number",
        default : 0
    },
    draws : {
        type : "Number",
        default : 0
    },
    connections : {
        type : "Number",
        default : 0
    },
    date : {
        type : "Date",
        default : Date.now()
    },
    videoBio : {
        type : "String",
        min : 6
    }
})

module.exports = mongoose.model("User" , schema)