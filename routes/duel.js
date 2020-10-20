const router = require("express").Router();
const cloudinary = require("../configs");
const authenticateUser = require("../authenticate/authenticateUser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const streamifier = require("streamifier");
const joi = require("joi");
const Duel = require("../models/duel");
const DuelRequest = require("../models/duelRequest");
const Notification = require("../models/notification");
const Response = require("../models/response");
const Comment = require("../models/comment")
const Points = require("../models/points");
const { async } = require("crypto-random-string");

router.use(upload.single("video"));

router.post("/uploadVideo", authenticateUser, async (req, res) => {
  console.log("Uploading video");
  try {
    const upload_video = await uploadVideo(req);
    console.log("Video uploaded");
    res.status(200).send({ response: upload_video.secure_url });
  } catch (error) {
    console.log(error);
  }
});

function uploadVideo(req) {
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: "foo",
        resource_type: "video",
        format: "mp4",
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
  });
}

router.post("/new", authenticateUser, async (req, res) => {
  if (req.body.coverPicture !== "") {
    cloudinary.uploader.upload(req.body.coverPicture, async function (
      error,
      result
    ) {
      if (error) {
        // console.log(error);
      } else {
        saveDuel(req, res, result.secure_url);
      }
    });
  } else {
    saveDuel(req, res, "");
  }
});

async function saveDuel(req, res, result) {
  req.body.coverPicture = result;

  const detailsToValidate = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
  };

  const schema = joi.object({
    title: joi.string().min(6).max(1024),
    description: joi.string().min(10).max(1024),
    category: joi.string().max(1024).min(3),
  });

  const validate = await schema.validate(detailsToValidate);

  if (validate.error)
    return res.status(200).send({
      error: "Could not create your duel. Check the details you entered.",
    });

  var open = false;

  if (req.body.opponent && Object.entries(req.body.opponent) !== 0) {
    open = false;
  } else {
    open = true;
  }

  const details = new Duel({
    title: req.body.title,
    description: req.body.description,
    video: req.body.video,
    coverPicture: req.body.coverPicture,
    category: req.body.category,
    rounds: req.body.rounds,
    duration: req.body.duration,
    creator: req.body.creator,
    open: open,
    lastPoster: req.body.creator.id,
  });

  try {
    const createDuel = await details.save();

    if (createDuel) {
      const response = new Response({
        responderID: req.body.creator.id,
        responderRole: "creator",
        video: req.body.video,
        duelID: createDuel._id,
      });

      await response.save()

      const request = new DuelRequest({
        duelID: createDuel._id,
        sender: req.user.id,
        recipient: req.body.opponent.id,
        senderDetails: req.body.creator,
        recipientDetails: req.body.opponent,
        duelTitle: req.body.title,
        coverPicture: req.body.coverPicture,
      });

      const sendRequest = await request.save();

      const notification = new Notification({
        type: "NewDuelRequest",
        contentID: createDuel._id,
        senderDetails: req.body.creator,
        recipient: req.body.opponent.id,
        message: " challenged you to a duel!",
        operation: "new challenge",
      });

      const saveNotification = await notification.save();

      res.status(200).send({ response: createDuel._id });
    } else {
      res
        .status(200)
        .send({ error: "Could not create duel. Please try again." });
    }
  } catch (error) {
    res.status(200).send({ error: "Could not create duel. Please try again." });
  }
}

router.post("/", async (req, res) => {
  if (req.body.duelID && req.body.duelID !== "") {
    try {
      const duel = await Duel.findOne({ _id: req.body.duelID });
      const duelRequest = await DuelRequest.findOne({
        duelID: req.body.duelID,
      });

      const comments = await Comment.find({duelID : req.body.duelID})

      if (duel) {
        const responses = await Response.find({ duelID: req.body.duelID });

        if (req.body.id) {
          const availableRequest = await DuelRequest.findOne({
            duelID: req.body.duelID,
            recipient: req.body.id,
          });

          if (availableRequest) {
            return res
              .status(200)
              .send({ duel, requestedToOppose: true, responses });
          } else {
            return res.status(200).send({ duel, responses, comments });
          }
        } else {
          return res.status(200).send({ duel, responses, comments });
        }
      } else {
        return res.status(200).send({ error: "Duel not found." });
      }
    } catch (error) {
      return res.status(200).send({ error: "Could not retrieve Duel" });
    }
  }
});

router.post("/accept", authenticateUser, async (req, res) => {
  var notificationMessage = "";

  try {
    const duel = await Duel.findOneAndUpdate(
      { _id: req.body.duelID },
      { opponent: req.body.recipientDetails }
    );

    if (duel) {
      const requestExists = await DuelRequest.findOne({
        duelID: req.body.duelID,
      });

      if (requestExists) {
        const removeRequest = await DuelRequest.findOneAndDelete({
          duelID: req.body.duelID,
          recipient: req.user.id,
        });
      }

      if (requestExists) {
        notificationMessage = " has accepted your duel request!";
      } else {
        notificationMessage = " has joined your duel!";
      }

      const notification = new Notification({
        type: "DuelRequest",
        contentID: req.body.duelID,
        senderDetails: req.body.recipientDetails,
        recipient: duel.creator.id,
        message: " accepted your duel request.",
        operation: "to duel",
      });

      const saveNotification = await notification.save();

      res.status(200).send({ accepted: true });
    }
  } catch (error) {}
});

router.post("/refuse", authenticateUser, async (req, res) => {
  const duel = await Duel.findOne({ _id: req.body.duelID });

  try {
    const removeRequest = await DuelRequest.findOneAndDelete({
      duelID: req.body.duelID,
      recipient: req.user.id,
    });

    const notification = new Notification({
      type: "DuelRequest",
      contentID: req.body.duelID,
      senderDetails: req.body.recipientDetails,
      recipient: duel.creator.id,
      message: " refused your duel request.",
      operation: "new opponent",
    });

    const saveNotification = await notification.save();
    res.status(200).send({ refused: true });
  } catch (error) {
    res
      .status(200)
      .send({ error: "Could not refuse duel request. Please try again." });
  }
});

module.exports = router;
