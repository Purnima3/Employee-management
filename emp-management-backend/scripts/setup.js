 const User = require("../models/user")
 const bcrypt = require('bcrypt')

 async function createAdmin(){
    try{
    const existAdmin = await User.findOne({email:'admin@test1.com'});
    if(existAdmin) {console.log('Admin already exists')}
    else{
        const newAdmin = User({
            firstName:"Admin",
            lastName:'mehta',
            email:"admin@test1.com",
            password:"admin",
            role:'admin'
        });
        await newAdmin.save();
        console.log("Admin account created successfully")
    }
    }catch(error){
        console.error(error.message)
    }
 }

 module.exports = {createAdmin}