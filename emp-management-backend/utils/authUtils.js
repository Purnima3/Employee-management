const jwt = require("jsonwebtoken");
const {secretkey} = require('../config/jwtConfig');

function  generateToken(user){
    const payload = {
        id:user._id,
        email:user.email,
        role:user.role
}

if (!secretkey) {
    throw new Error("JWT secret is not defined");
  }
return jwt.sign(payload,secretkey,{expiresIn:"1h"});
};
function  generateRefreshToken(user){
    const payload = {
        id:user._id,
        email:user.email,
        role:user.role
}
return jwt.sign(payload,secretkey,{expiresIn:"7h"});
};

function varifyToken(token){
    return jwt.varify(token,secretkey)
}

module.exports={generateToken,generateRefreshToken,varifyToken};