const User = require('../models/user'); 
const bcrypt = require('bcrypt');// Adjust the path as needed

// Fetch all users
const fetchUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json(users); // Send the users as a JSON response
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create a new user
const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        // Ensure that all required fields are provided
        if (!firstName || !lastName || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role
        });

        // Await the save operation
        const savedUser = await newUser.save(); // Make sure to await this operation

        res.status(201).json({ message: "User created successfully", savedUser });
    } catch (err) {
        // Log the error for debugging
        console.error("Error creating user:", err);

        // Send a more descriptive error message to the client
        res.status(400).json({ message: "Error creating user. Please try again." });
    }
};

// Export the controller functions
module.exports = {
    fetchUsers,
    createUser,
};
