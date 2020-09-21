const router = require("express").Router();
const cloudinary = require("../configs");
const authenticateUser = require("../authenticate/authenticateUser");
const multer = require("multer")
const upload = multer({ dest: 'uploads/' })
const streamifier = require("streamifier");
const joi = require("joi")
const Duel = require("../models/duel")
const { async } = require("crypto-random-string");

router.use(upload.single("video"))


router.post("/uploadVideo", authenticateUser, async (req, res) => {
  

  try {
    const upload_video = await uploadVideo(req)
    res.status(200).send({response : upload_video.secure_url})
  } catch (error) {
      console.log(error);
  }



});

function uploadVideo(req) {
    return new Promise((resolve, reject) => {

        let cld_upload_stream = cloudinary.uploader.upload_stream(
         {
           folder: "foo",
           "resource_type" : "video",
           format : "mp4"
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


router.post("/new", authenticateUser, async(req,res) => {


    if(req.body.coverPicture !== ""){
        cloudinary.uploader.upload(req.body.coverPicture, async function (error, result) {
            if(error){
                // console.log(error);
            } else {

                req.body.coverPicture = result.secure_url

                const detailsToValidate = {
                  title : req.body.title,
                  description : req.body.description,
                  category : req.body.category
                }

                const schema = joi.object({
                  title : joi.string().min(6).max(1024),
                  description : joi.string().min(10).max(1024),
                  category: joi.string().max(1024).min(3)
                })

                const validate = await schema.validate(detailsToValidate)

                if(validate.error) return res.status(200).send({error : "Could not create your duel. Check the details you entered."})

                if(req.body.rounds === ""){
                  req.body.rounds = 3
                }

                if(req.body.duration === ""){
                  req.body.duration === "1 Day"
                }


                const details = new Duel ({
                  title : req.body.title,
                  description : req.body.description,
                  video : req.body.video,
                  coverPicture : req.body.coverPicture,
                  category : req.body.category,
                  rounds : req.body.rounds,
                  duration : req.body.duration,
                  creator : req.body.creator
                })

                

                try {
                  const createDuel = await details.save()

                  if(createDuel){
                    res.status(200).send({response : createDuel._id})
                  } else {
                    res.status(200).send({error : "Could not create duel. Please try again."})
                  }
                } catch (error) {
                  res.status(200).send({error : "Could not create duel. Please try again."})
                }




            }
        })
    } else {

    }
})


async function saveDuel (params) {
    
}

module.exports = router;
