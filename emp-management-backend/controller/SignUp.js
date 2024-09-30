const User = require("../models/user");
const bcrypt = require("bcrypt");
console.log("controler called")
async function signupUser(req,res){
    try{
        const {firstName, lastName,email,password,role} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            firstName, lastName,email,password:hashedPassword,
            role
        })
        const savedUser = newUser.save()
        res.status(201).json({message:"user created successfully",savedUser});
    }
    catch(err){
        res.status(400).json({message:message.error});
        }
    }
   
    module.exports = {signupUser};