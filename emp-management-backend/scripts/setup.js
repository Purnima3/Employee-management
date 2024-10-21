 const User = require("../models/user")
 const bcrypt = require('bcrypt')

 async function createAdmin(){
    try{
    const existAdmin = await User.findOne({email:'admin@test2.com'});
    if(existAdmin) {console.log('Admin already exists')}
    else{
        const hashedPassword = await bcrypt.hash('admin@123', 10);
        const newAdmin = User({
            firstName:"Admin",
            lastName:'mehta',
            email:"admin@test2.com",
            password:hashedPassword,
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