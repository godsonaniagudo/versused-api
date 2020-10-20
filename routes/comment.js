const { async } = require("crypto-random-string");
const authenticateUser = require("../authenticate/authenticateUser");
const Comment = require("../models/comment")
const Commenter = require("../models/commenter")

const router = require("express").Router()

router.post("/new", authenticateUser, async(req,res) => {
    if(req.body.commentText !== "" && req.body.commentText.length !== 0){
        const comment = new Comment({
            commenterDetails : req.body.commenterDetails,
            commenter : req.body.commenter,
            commentText : req.body.commentText,
            duelID : req.body.duelID
        })

        const saveComment = await comment.save()

        const commented = await Commenter.findOne({commenterID : req.body.commenter, duelID : req.body.duelID})

        if(commented){
            res.status(200).send({response : "OK", comment : saveComment})
        } else {
            const commenter = new Commenter({
                commenterAlias : req.body.commenterDetails.alias,
                commenterID : req.body.commenter,
                duelID : req.body.duelID
            })

            const newCommenter = await commenter.save()

            res.status(200).send({response : "OK", comment : saveComment})

        }
    }
})

module.exports = router