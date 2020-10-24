const { async } = require("crypto-random-string")
const authenticateUser = require("../authenticate/authenticateUser")

const router = require("express").Router()
const Bookmark = require("../models/bookmark")

router.post("/add", authenticateUser, async(req,res) => {

    const checkBookmarkExists = await Bookmark.findOne({duelID : req.body._id})

    console.log(checkBookmarkExists);
    if(!checkBookmarkExists){
        const bookmark = new Bookmark({
            duelID : req.body._id,
            duelTitle : req.body.title,
            duelDescription : req.body.description,
            userID : req.user.id,
            coverPicture : req.body.coverPicture,
            video : req.body.video,
            creator : req.body.creator
        })

        try {
            const saveBookmark = await bookmark.save()

            res.status(200).send({response : "OK"})
        } catch (error) {
            res.status(200).send({error : "Could not save bookmark"})
        }
    }
})

router.post("/remove", authenticateUser, async(req,res) => {

    const checkBookmarkExists = await Bookmark.findOne({duelID : req.body.duelID})


    if(checkBookmarkExists){


        try {
            const removeBookmark = await Bookmark.findOneAndDelete({duelID : req.body.duelID, userID : req.user.id})

            if(removeBookmark){
                res.status(200).send({response : "OK"})
            }
            
        } catch (error) {
            res.status(200).send({error : "Could not save bookmark"})
        }
    }
})

module.exports = router