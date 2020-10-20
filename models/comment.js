const mongoose = require("mongoose")

const schema = mongoose.Schema({
    commenterDetails : {
        type : "Object",
        required : true
    },
    duelID : {
        type : "String",
        min : 6,
        required : true
    },
    commenter : {
        type : "String",
        min : 6,
        required : true
    },
    commentText : {
        type : "String",
        min : 1,
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    }
})

module.exports = mongoose.model("Comment" , schema)