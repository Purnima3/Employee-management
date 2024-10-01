const mongoose = require("mongoose");
const { faker } = require('@faker-js/faker');
const connectDB = require('../config/db');
const User = require("../models/user");
const LearningMaterial = require("../models/LearningMaterial");
const Feedback = require("../models/Feedback");
const Engagement = require("../models/Engagement");
const Employee = require("../models/employee");
// require('dotenv').config();


// const startServer = async () => {
//     await connectDB();
// };

// try{
// startServer();
// }
// catch (error) {
// console.error('Error connecting to MongoDB:', error); 
// process.exit(1);
// }


const generateFakeUsers = async (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      firstName: faker.person.firstName(),  
      lastName: faker.person.lastName(),    
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "employee",
    });
  }
  await User.insertMany(users);
  console.log(`${count} users inserted`);
};

const generateFakeLearningMaterials = async (count) => {
  const materials = [];
  for (let i = 0; i < count; i++) {
    materials.push({
      title: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      duration: faker.number.int({ min: 30, max: 180 }), // Updated method
      contentUrl: faker.internet.url(),
      department: faker.helpers.arrayElement(["Data Science", "Data Engineering", "Full Stack"]),
    });
  }
  await LearningMaterial.insertMany(materials);
  console.log(`${count} learning materials inserted`);
};

const generateFakeFeedback = async (count) => {
  const users = await User.find();
  const materials = await LearningMaterial.find();
  const feedbacks = [];

  for (let i = 0; i < count; i++) {
    feedbacks.push({
      userId: faker.helpers.arrayElement(users)._id,
      learningMaterialId: faker.helpers.arrayElement(materials)._id,
      feedback: faker.lorem.sentence(),
      rating: faker.number.int({ min: 1, max: 5 }),
    });
  }
  await Feedback.insertMany(feedbacks);
  console.log(`${count} feedbacks inserted`);
};

const generateFakeEngagements = async (count) => {
  const users = await User.find();
  const materials = await LearningMaterial.find();
  const engagements = [];

  for (let i = 0; i < count; i++) {
    engagements.push({
      userId: faker.helpers.arrayElement(users)._id,
      learningMaterialId: faker.helpers.arrayElement(materials)._id,
      timeSpent: faker.number.int({ min: 0, max: 300 }), // Updated method
      quizScore: faker.number.int({ min: 0, max: 100 }), // Updated method
      participationCount: faker.number.int({ min: 1, max: 10 }), // Updated method
      lastAccessed: faker.date.past(),
    });
  }
  await Engagement.insertMany(engagements);
  console.log(`${count} engagements inserted`);
};

const generateFakeEmployees = async (count) => {
  const users = await User.find();
  const employees = [];

  for (let i = 0; i < count; i++) {
    employees.push({
      user_id: faker.helpers.arrayElement(users)._id,
      department: faker.helpers.arrayElement(["Data Science", "Data Engineering", "Full Stack"]),
    });
  }
  await Employee.insertMany(employees);
  console.log(`${count} employees inserted`);
};

const populateDB = async () => {
    
  await   connectDB();

  try {
    await generateFakeUsers(1000);
    await generateFakeLearningMaterials(1000);
    await generateFakeFeedback(1000);
    await generateFakeEngagements(1000);
    await generateFakeEmployees(1000);
    console.log("Database populated successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    mongoose.connection.close();
  }
};

populateDB();
