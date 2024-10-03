const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { createAdmin } = require('./scripts/setup'); // Ensure this path is correct

const signupRoute = require('./routes/Signup');
const loginRoute = require('./routes/Login');
const learningMaterialsRouter = require('./routes/learningMaterials');
const EngagementRouter = require('./routes/engagement');

const userRouter = require('./routes/user')
const sendEmailRouter = require('./routes/send-email')
const feedbackRouter = require('./routes/feedback')
const ForgetPassword = require('./routes/forgetPassword');
const dashboardRoutes = require('./routes/Dashboard')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();
console.log("Mongo URI: ", process.env.MONGO_URI);

// Middleware
app.use(cors());
app.use(express.json());
console.log("server.js called");

// Routes
app.use('/', signupRoute);
app.use('/', loginRoute);
app.use('/learning-materials', learningMaterialsRouter);
app.use('/engagement', EngagementRouter);
app.use('/feedback', feedbackRouter);
app.use('/users',userRouter)
app.use('/',sendEmailRouter)
app.use('/',feedbackRouter)
app.use('/',ForgetPassword)
app.use('/dashboard',dashboardRoutes)

app.get("/", (req, res) => {
    res.send("Hello World");
});


createAdmin().then(() => {
    console.log("Checked for admin user.");
}).catch(err => {
    console.error("Error creating admin user:", err);
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
