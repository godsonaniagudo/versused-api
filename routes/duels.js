const router = require("express").Router()
const authenticateUser = require("../authenticate/authenticateUser")
const Duel = require("../models/duel")
const User = require("../models/user")

router.get("/recommended", authenticateUser, async (req,res) => {
    const user = await User.findOne({_id : req.user.id})

    if(user){
        if(user.categories.length === 0) return res.status(200).send({noCategories : "You have not set your preferred categories."})

        const userCategoryQueries = []

        user.categories.forEach(element => {
            userCategoryQueries.push({category : element})
        });

        
        
        try {
            const foundDuels = await Duel.find({$or : userCategoryQueries})

            if(!foundDuels || foundDuels.length === 0){
                return res.status(404).send({error : "No duels were found for your preferred categories"})
            } else {
                return res.status(200).send({duels : foundDuels})
            }
        } catch (error) {
            
        }
    }
})

module.exports = router