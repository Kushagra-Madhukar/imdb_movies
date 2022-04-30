const mongoose = require("mongoose");
const router = require("express").Router();
const { COOKIE_DOMAIN, SECURED_COOKIE, SAME_SITE_COOKIE } = require("../config");
const User = mongoose.model("User");
const utils = require("../lib/utils");

//Login route using jwt
router.post("/jwt", function (req, res ) {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if(user){
      // Check if password is valid
      const isValid = utils.validPassword(
        req.body.password,
        user.hash,
        user.salt
      );

      if (isValid) {
        const tokenObject = utils.issueJWT(user);
        res.cookie('token' ,tokenObject.token, {httpOnly: true, maxAge: 2*24*60*60*1000, expires: new Date(Date.now() + 2*24*60*60*1000), secure: SECURED_COOKIE, domain: COOKIE_DOMAIN, sameSite: SAME_SITE_COOKIE});
        res.send({
          success: true,
          msg: {
            username: user.username,
            isAdmin: user.isAdmin,
          },
          expiresIn: tokenObject.expires
        });
      } else {
        res.status(200).json({ success: false, msg: {password: "Wrong password", email:""} });
      }
    }
    else {
      res.send({success: false, msg: {email:`Failed to login`, password: ""}})
    }
    })
    .catch((err) => {
      console.log(err)
      res.send({success: false, msg: {password: 'An error occured, please try again later', email: ""}})
    });
});

router.post('/register', function(req, res, next){
  const saltHash = utils.genPassword(req.body.password);
  //Also add a function to check if username already exist in db for some other user
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  //add new user
  const newUser = new User({
      username: req.body.username,
      hash: hash,
      salt: salt,
      isAdmin: true
  });

  User.findOne({ username: req.body.username})
  .then((user) => {
    if (!user) {
      try {
          newUser.save()
            .then((user) => {
              res.cookie('token' ,verifyToken.token, {httpOnly: true, maxAge: 2*24*60*60*1000, expires: new Date(Date.now() + 2*24*60*60*1000), sameSite: SAME_SITE_COOKIE, secure: SECURED_COOKIE, domain: COOKIE_DOMAIN})
              res.status(200).send({ success: true, msg: {username: user.username, isAdmin: user.isAdmin}}); 
            })
            .catch(err => {
              res.send({success: false, msg: {username: '', password: '', general: "An error occured while registering, please try again later."}})
            })
      } catch (err) {
          res.send({success: false, msg: {username: '', password: '', general: "An error occured while registering, please try again later."}})
      }
    } else {
        //Need to first verify the user as well
     res.json({success: false, msg: {username: 'User already exists', password: '', general: ""}})
    }
  })
  .catch(err => {
      res.json({success: false, msg: {username: '', password: '', general: "An error occured while registering, please try again later."}})
  })
});

router.get('/logout', (req, res, next) => {
  res.cookie('token' ,'loggedOut', {httpOnly: true, maxAge: 2*24*60*60*1000, expires: new Date(Date.now() - 2*24*60*60*1000), sameSite: SAME_SITE_COOKIE, secure: SECURED_COOKIE, domain: COOKIE_DOMAIN});
  
  res.send({ success: true, msg: 'Logout success'});
});

module.exports = router;



  