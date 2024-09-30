const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { createAdmin } = require('./scripts/setup'); // Ensure this path is correct

const signupRoute = require('./routes/Signup');
const loginRoute = require('./routes/Login');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
console.log("server.js called");

// Routes
app.use('/', signupRoute);
app.use('/', loginRoute);

// Root route for testing
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Call createAdmin function to ensure the admin user is created
createAdmin().then(() => {
    console.log("Checked for admin user.");
}).catch(err => {
    console.error("Error creating admin user:", err);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
