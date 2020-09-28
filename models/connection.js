const mongoose = require("mongoose")

const schema = mongoose.Schema({
    id1 : {
        type : "String",
        min : 6,
        max : 1024,
        required : true
    }, 
    id2 : {
        type : "String",
        min : 6,
        max : 1024,
        required : true
    },
    id1Details : {
        type :"Object",
        default: {}
    },
    id2Details : {
        type :"Object",
        default: {}
    },
    connectionStatus : {
        type : "String",
        default : "pending"
    },
    duels : {
        type : "Number",
        default : 0
    },
    date : {
        type : "Date",
        default : Date.now()
    }
})

module.exports = mongoose.model("Connection", schema)