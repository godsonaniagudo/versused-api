const router = require("express").Router();
const User = require("../models/user");
const joi = require("joi");
const { valid } = require("joi");
const bcrypt = require("bcrypt");
const randomString = require("crypto-random-string");
const { async } = require("crypto-random-string");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

router.post("/signup", async (req, res) => {
  console.log(req.body);
  const emailRegistered = await User.findOne({ email: req.body.email });

  if (emailRegistered)
    return res.status(400).send({ error: "Email address already registered." });

  const joiSchema = joi.object({
    name: joi.string().min(3).max(1024),
    alias: joi.string().min(3).max(1024),
    email: joi.string().min(3).max(1024).email(),
    password: joi.string().min(6).max(1024),
  });

  const validData = await joiSchema.validate(req.body);

  if (validData.error)
    return res.status(400).send({ error: validData.error.details[0].message });

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(req.body.password, salt);

  const verificationString = await randomString({
    length: 30,
    type: "url-safe",
  });

  console.log(verificationString);

  try {
    const user = new User({
      name: req.body.name,
      alias: req.body.alias,
      email: req.body.email,
      password: hash,
      verificationString: verificationString,
    });

    const newUser = await user.save();

    var url = "https://versused.herokuapp.com/verifyEmail/" + verificationString;

    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_KEY);
    const msg = {
      to: req.body.email,
      from: "tiergodson@gmail.com",
      subject: "Verify Your Email Address!",
      text: "Verify Your Email Address!",
      templateId: "d-defc00b771cd43a8872d48c7b3672bbb",
      dynamic_template_data: {
        subject: "Verify Your Email Address!",
        url: url,
        name: req.body.name,
      },
      html: "<h1></h1>",
    };
    //ES6
    sgMail.send(msg).then((result) => {
      res.status(200).send({ response: "OK" });
      console.log(result);
      console.log("Sent");
    }, console.error);

    // setTimeout(async () => {
    //     const removeVerification  = await User.findOneAndUpdate({email : req.body.email},{$unset : {verificationHash : ""}})
    //   }, 10000)

    // console.log(newUser);
  } catch (error) {}
});

router.post("/checkAlias", async (req, res) => {
  try {
    const aliasAvailable = await User.findOne({ alias: req.body.alias });

    if (aliasAvailable) {
      res.status(200).send({ unavailable: "Alias is already taken" });
    } else {
      res.status(200).send({ available: "Alias is available!" });
    }
  } catch (error) {}
});

router.post("/email/verify", async (req, res) => {
  const available = await User.findOne({ verificationString: req.body.hash });
  if (!available)
    return res.status(400).send({
      error:
        "Could not verify email. Email already verified or verification email has expired.",
    });

  if(available.accountStatus === "active"){
    return res.status(200).send({error : "Account already verified."})
  }

  const updateAccountStatus = await User.findOneAndUpdate(
    { verificationString: req.body.hash },
    { accountStatus: "active", $unset: { verificationString: "" } }
  );

  try {
    const token = await jwt.sign({ id: available._id }, process.env.JWT_STRING);
    if (token) {
      return res
        .status(200)
        .header("authtoken", token)
        .header("access-control-expose-headers", "authtoken")
        .send({
          response: "OK",
          name: available.name,
          alias: available.alias,
          id: available._id,
          profilePic: available.profilePic,
          accountStatus: "active",
        });
    }
  } catch (error) {}
});

router.post("/login", async(req, res) => {
  const userExists = await User.findOne({email : req.body.loginDetails.email})

  if(!userExists) return res.status(200).send({error : "No account exists for this email address."})

  const validPassword = await bcrypt.compare(req.body.loginDetails.password , userExists.password)

  if(validPassword === false) return res.status(200).send({error : "Password is incorrect."})

  const token = await jwt.sign({id : userExists._id} , process.env.JWT_STRING)



  if(token){
    return res
    .status(200)
    .header("authtoken", token)
    .header("access-control-expose-headers", "authtoken")
    .send({
      response: "OK",
      name: userExists.name,
      alias: userExists.alias,
      id: userExists._id,
      profilePic: userExists.profilePic,
      accountStatus: userExists.accountStatus,
    });
  }
})

router.post("/password/reset/send" , async(req,res) => {

  const userExists = await User.findOne({email : req.body.resetEmail})

  if(!userExists) return res.status(200).send({error : "No account exists for this email address"})
  const resetString = randomString({length: 30, type: 'url-safe'})
  
  const saveString = await User.findOneAndUpdate({email : req.body.resetEmail}, {resetString : resetString}, {useFindAndModify : false})
  
  setTimeout(async () => {
    const removeString = await User.findOneAndUpdate({email : req.body.email}, {$unset : {resetString : ""}})
  }, 1440000)


  var url = "https://versused.herokuapp.com/resetPassword/" + resetString


  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_KEY);
  const msg = {
    to: saveString.email,
    from: 'tiergodson@gmail.com',
    subject: 'Reset Password.',
    text: 'Reset Password.',
    templateId: 'd-9a4d65dd2b144964b2d4398e87642903',
    dynamic_template_data: {
      subject: 'Reset Password.',
      link: url,
      name : saveString.name
    },
    html: "<h1></h1>"
  };
  //ES6
  sgMail
    .send(msg)
    .then((result) => {
      res.status(200).send({response : "OK"})
    }, console.error);
})

router.post("/password/reset/hashCheck", async(req,res) => {
  
  try {
    const validHash = await User.findOne({resetString : req.body.hash})

    if(validHash){
      return res.status(200).send({response : "OK"})
    } else {
      return res.status(200).send({error : "Invalid reset request. Reset link may have expired."})
    }
  } catch (error) {
    return res.status(200).send({error : "Invalid reset request. Reset link may have expired."})
  }
})

router.post("/password/reset", async (req,res) => {
  if (req.body.passwords.newPassword === req.body.passwords.confirmation){
    

    const user = await User.findOne({resetString : req.body.hash})

    const passwordExists = await bcrypt.compare(req.body.passwords.newPassword , user.password)

    if(passwordExists === true) return res.status(200).send({error : "You cannot reuse a password you have used recently."})

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.passwords.newPassword , salt)

    try {
      const setNewPassword = await User.findOneAndUpdate({resetString : req.body.hash} , {password : password, $unset : {resetString : ""}} ,  {useFindAndModify : false})

      if(setNewPassword){
        res.status(200).send({response : "OK"})
      } else {
        res.status(200).send({error : "Could not reset password. Please try again."})
      }
    } catch (error) {
      res.status(200).send({error : "Could not reset password. Please try again."})
    }
  } else {
    res.status(200).send({error : "Passwords do not match"})
  }
})

module.exports = router;
