const router = require('express').Router();
const utils = require('../lib/utils');
const { SECURED_COOKIE, COOKIE_DOMAIN, SAME_SITE_COOKIE } = require('../config');

router.get('/logout', (req, res) => {
    res.cookie('token' ,'loggedOut', {httpOnly: true, maxAge: 2*24*60*60*1000, expires: new Date(Date.now() - 2*24*60*60*1000), sameSite: SAME_SITE_COOKIE, secure: SECURED_COOKIE, domain: COOKIE_DOMAIN});
    res.send({ success: true, msg: 'Logout success'});
});

router.get('/profile', utils.authMiddleware, (req, res, next) => {
    if(req.jwt){
        if(req.jwt.isAdmin){
            res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!", profile: req.jwt, showAlert: false, alertMsg: '', trialActive: false, trialTaken: req.jwt.trialTaken});
        }
        else {
            res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!", profile: req.jwt, showAlert: true, alertMsg: 'Your free trial has expired. Consider subscribing to the product', trialActive: false, trialTaken: true});
        }
    }
    else res.status(200).json({ success: false, msg: "You are not authenticated"});
})

module.exports = router;