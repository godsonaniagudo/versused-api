const router = require("express").Router()
const { async } = require("crypto-random-string")
const authenticateUser = require("../authenticate/authenticateUser")
const Bookmark = require("../models/bookmark")
const Duel = require("../models/duel")
const DuelRequest = require("../models/duelRequest")
const User = require("../models/user")

router.get("/recommended", authenticateUser, async (req,res) => {
    const user = await User.findOne({_id : req.user.id})
    const bookmarks = await Bookmark.find({userID : req.user.id}).select("duelID -_id")



    if(user){
        if(user.categories.length === 0){
            const foundDuels = await Duel.find().limit(20)
            return res.status(200).send({noCategories : "You have not set your preferred categories.", recentDuels : foundDuels, bookmarks})
        } else {
            const userCategoryQueries = []

        user.categories.forEach(element => {
            userCategoryQueries.push({category : element})
        });

        
        
        try {
            const foundDuels = await Duel.find({$or : userCategoryQueries})

            if(!foundDuels || foundDuels.length === 0){
                return res.status(404).send({error : "No duels were found for your preferred categories"})
            } else {
                return res.status(200).send({duels : foundDuels, bookmarks})
            }
        } catch (error) {
            
        }
        }

        
    }
})

router.post("/byCategory", authenticateUser, async (req,res) => {
    if(req.body.category){
        try {
            const duels = await Duel.find({category : req.body.category})
            return res.status(200).send({duels})
        } catch (error) {
            return res.status(200).send({error : "Could not retireve duels."})
        }
    }
    
})

router.get("/requests", authenticateUser, async (req,res) => {
   const requests = await DuelRequest.find({recipient : req.user.id})
   
   if(requests){
       res.status(200).send({requests : requests})
   } else {
       res.status(200).send({none : "You have no pending requests."})
   }
})



module.exports = router