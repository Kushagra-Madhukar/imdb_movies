const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const pathToPubKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');
const PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8');

function validPassword(password, hash, salt) {
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}

function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    return {
      salt: salt,
      hash: genHash
    };
}

function issueJWT(user) {
  const _id = user._id;

  const expiresIn = '1d';

  const payload = {
    username: user.username,
    sub: _id,
    iat: Date.now(),
    isAdmin: user.isAdmin
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  }
}

function authMiddleware(req, res, next) {
  if(!req.cookies.token){
    return res.status(200).send({success: false, msg: "You need to login first"});
  }
  const tokenParts = req.cookies.token.split(' ');

  if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {
    try {
      const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, { algorithms: ['RS256'] });
      if(verification) req.jwt = verification;
      else res.status(200).json({ success: false, msg: "You are not authorized to visit this route" });
      next();
    } catch(err) {
      res.status(200).json({ success: false, msg: "You are not authorized to visit this route" });
    }

  } else {
    res.status(200).send({ success: false, msg: "You are not authorized to visit this route" });
  }
} 

function adminMiddleware(req, res, next){
  if(req.jwt.isAdmin){
    next()
  } else {
    res.send({success: false, msg: "You do not have admin priviledges"})
  }
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
module.exports.authMiddleware = authMiddleware;
module.exports.adminMiddleware = adminMiddleware;