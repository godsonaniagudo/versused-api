const authenticateUser = require("../authenticate/authenticateUser");

const router = require("express").Router();
const Points = require("../models/points");
const Duel = require("../models/duel");
const { async } = require("crypto-random-string");

router.post("/give", authenticateUser, async (req, res) => {
  const duel = await Duel.findOne({ _id: req.body.duelID });
  const givenPoint = await Points.findOne({
    duelID: req.body.duelID,
    giverID: req.body.giver.id,
  });

  if (givenPoint) {
    if (givenPoint.gaveTo === req.body.recipientID) {
      await Points.findOneAndDelete({
        duelID: req.body.duelID,
        giverID: req.body.giver.id,
      });

      if (givenPoint && givenPoint.gaveTo === req.body.recipientID && req.body.recipientID === duel.creator.id){
        await Duel.findOneAndUpdate({_id : req.body.duelID} , {$inc : {creatorPoints : -1}})
      } else {
        await Duel.findOneAndUpdate({_id : req.body.duelID} , {$inc : {opponentPoints : -1}})
      }

      res.status(200).send({ response: "OK", gaveTo: "", takeBack: true });
    } else {
      const updatePoints = await Points.findOneAndUpdate(
        { duelID: req.body.duelID, giverID: req.body.giver.id },
        { gaveTo: req.body.recipientID }
      );


      if (req.body.recipientID === duel.creator.id){
        await Duel.findOneAndUpdate({_id : req.body.duelID} , {$inc : {creatorPoints : 1, opponentPoints : -1}  })
      } else {
        await Duel.findOneAndUpdate({_id : req.body.duelID} , {$inc : {opponentPoints : 1, creatorPoints : -1} })
      }

      res.status(200).send({ response: "OK", gaveTo: req.body.recipientID});
    }
  } else {
    const point = new Points({
      duelID: req.body.duelID,
      gaveTo: req.body.recipientID,
      giverID: req.body.giver.id,
      giverDetails: req.body.giver,
    });

    try {
      const givePoint = await point.save();


        
      if (req.body.recipientID === duel.creator.id){
        await Duel.findOneAndUpdate({_id : req.body.duelID} , {$inc : {creatorPoints : 1} })
      } else {
        await Duel.findOneAndUpdate({_id : req.body.duelID} , {$inc : {opponentPoints : 1}})
      }


      res.status(200).send({ response: "OK", gaveTo: req.body.recipientID });
    } catch (error) {}
  }
});

router.post("/check", authenticateUser, async (req, res) => {
  try {
    const exists = await Points.findOne({
      duelID: req.body.duelID,
      giverID: req.user.id,
    });

    if (exists) {
      return res.status(200).send({ response: "OK", gaveTo: exists.gaveTo });
    } else {
      return res.status(200).send({ response: "OK", gaveTo: exists.gaveTo });
    }
  } catch (error) {
    return res.status(200).send({ error: "Could not check." });
  }
});

module.exports = router;
