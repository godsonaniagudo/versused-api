const mongoose = require("mongoose")

const schema = mongoose.Schema({
    title : {
        type : "String",
        min : 6,
        max : 1034,
        required : true
    },
    description : {
        type : "String",
        min : 6,
        max : 1034,
        required : true
    }, 
    category : {
        type : "String",
        min : 6,
        max : 1034,
        required : true
    },
    rounds : {
        type : "Number",
        min : 1,
        max : 1034,
        default: 3
    },
    duration : {
        type : "Number",
        min : 1,
        max : 1034,
        default: 1
    },
    winner : {
        type : "Object",
        default: {}
    },
    opponent : {
        type : "Object",
        default : {}
    },
    creator : {
        type :"Object",
        default: {}
    },
    date : {
        type : "Date",
        default : Date.now()
    },
    creatorPoints : {
        type : "Number",
        default : 0
    },
    opponentPoints : {
        type : "Number",
        default : 0
    },
    video : {
        type : "String",
        min : 6,
        required : true
    },
    open : {
        type : "Boolean",
        required : true
    },
    coverPicture : {
        type : "String",
        min : 6
    }
})

module.exports = mongoose.model("Duel", schema)