const { async } = require("crypto-random-string");
const authenticateUser = require("../authenticate/authenticateUser");
const cloudinary = require("../configs");
const User = require("../models/user");

const router = require("express").Router();

router.get("/details", authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    const userDetails = {
      name: user.name,
      accountStatus: user.accountStatus,
      alias: user.alias,
      profilePic: user.profilePic,
      id: req.user.id,
      accountStatus: user.accountStatus,
    };

    if (userDetails) {
      if (userDetails.accountStatus === "inactive") {
        return res.status(400).send({ error: "Account inactive." });
      } else {
        return res.status(200).send({ response: userDetails });
      }
    } else {
      res
        .status(400)
        .send({
          error:
            "Could not find account details. Account may have been deleted.",
        });
    }
  } catch (error) {
    res
      .status(400)
      .send({
        error: "Could not find account details. Account may have been deleted.",
      });
  }
});

router.post("/displayPicture/set", authenticateUser, async (req, res) => {
  if (req.body.picture && req.body.picture !== "") {
    cloudinary.uploader.upload(req.body.picture, async function (error, result) {
      
      if(error){
        return res.status(200).send({error : "Could not upload picture. Please try again."})
      } else {
        try {
          const setPicture = await User.findOneAndUpdate({_id : req.user.id} , {profilePic : result.secure_url}, {useFindAndModify : false})
          res.status(200).send({response : "OK", profilePic : result.secure_url})
        } catch (error) {
          return res.status(200).send({error : "Could not set picture. Please try again."})
        }

      }
      
    });
  }
});

router.post("/preferredCategories/set", authenticateUser, async (req,res) => {
  console.log(req.body);
  try {
    const updatePreferredCategories = User.findOneAndUpdate({_id : req.user.id} , {categories : req.body.selectedCategories}, {useFindAndModify : false})
    if(updatePreferredCategories){
      res.status(200).send({response : "OK"})
    } else {
      res.status(200).send({error : "Could not set categories. Please try again."})
    }
  } catch (error) {
    res.status(400).send({error : "Could not set categories. Please try again."})
  }
})


module.exports = router;