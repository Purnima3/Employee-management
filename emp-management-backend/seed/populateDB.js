const mongoose = require("mongoose");
const { faker } = require('@faker-js/faker'); // Import faker
const connectDB = require('../config/db'); // Import DB configuration
const User = require("../models/user");
const LearningMaterial = require("../models/LearningMaterial");
const Module = require("../models/module");
const Quiz = require("../models/Quiz");
const Feedback = require("../models/Feedback");
const Engagement = require("../models/Engagement");

// Function to connect to the database
const connectToDatabase = async () => {
  try {
    await connectDB(); // Connect to the database using the connectDB function
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

// Function to generate user data
const generateUsers = (n) => {
  const users = [];
  for (let i = 0; i < n; i++) {
    users.push({
      _id: new mongoose.Types.ObjectId(),
      firstName: faker.person.firstName(), // Use faker.person instead of faker.name
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(['admin', 'employee']),
      department: faker.helpers.arrayElement(["Data Science", "Data Engineering", "Full Stack"]),
      password: faker.internet.password(),
    });
  }
  return users;
};

// Function to generate learning materials
const generateLearningMaterials = (n) => {
  const materials = [];
  for (let i = 0; i < n; i++) {
    materials.push({
      _id: new mongoose.Types.ObjectId(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      duration: faker.number.int({ min: 30, max: 180 }), // Updated datatype to number.int
      contentUrl: faker.internet.url(),
      department: faker.helpers.arrayElement(["Data Science", "Data Engineering", "Full Stack"]),
      createdAt: faker.date.recent(),
    });
  }
  return materials;
};

// Function to generate engagement data
const generateEngagements = (users, learningMaterials, n) => {
  const engagements = [];
  for (let i = 0; i < n; i++) {
    engagements.push({
      userId: faker.helpers.arrayElement(users)._id, // Use faker.helpers.arrayElement instead of faker.random
      learningMaterialCompletion: [
        {
          learningMaterialId: faker.helpers.arrayElement(learningMaterials)._id,
          completed: faker.datatype.boolean(),
        },
      ],
      quizScore: faker.number.int({ min: 0, max: 100 }), // Updated datatype to number.int
    });
  }
  return engagements;
};

// Function to generate feedback data
const generateFeedbacks = (users, learningMaterials, n) => {
  const feedbacks = [];
  for (let i = 0; i < n; i++) {
    feedbacks.push({
      userId: faker.helpers.arrayElement(users)._id,
      learningMaterialId: faker.helpers.arrayElement(learningMaterials)._id,
      feedback: faker.lorem.sentence(),
      rating: faker.number.int({ min: 1, max: 5 }), // Updated datatype to number.int
      createdAt: faker.date.recent(),
    });
  }
  return feedbacks;
};

// Function to generate module data
const generateModules = (learningMaterials, n) => {
  const modules = [];
  for (let i = 0; i < n; i++) {
    modules.push({
      _id: new mongoose.Types.ObjectId(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      contentUrl: faker.internet.url(),
      learningMaterialId: faker.helpers.arrayElement(learningMaterials)._id,
    });
  }
  return modules;
};

// Function to generate quiz data
const generateQuizzes = (learningMaterials, n) => {
  const quizzes = [];
  for (let i = 0; i < n; i++) {
    const questions = [];
    for (let j = 0; j < 5; j++) { // Assuming 5 questions per quiz
      questions.push({
        question: faker.lorem.sentence(),
        options: [faker.lorem.word(), faker.lorem.word(), faker.lorem.word(), faker.lorem.word()],
        answer: faker.lorem.word(),
      });
    }
    quizzes.push({
      _id: new mongoose.Types.ObjectId(),
      title: faker.lorem.sentence(),
      questions: questions,
      learningMaterialId: faker.helpers.arrayElement(learningMaterials)._id,
    });
  }
  return quizzes;
};

// Main function to generate and store data
const seedDatabase = async () => {
  await connectToDatabase(); // Establish database connection

  const numEntries = 300; // Number of entries to generate

  // Generate data
  const users = generateUsers(numEntries);
  const learningMaterials = generateLearningMaterials(numEntries);
  const modules = generateModules(learningMaterials, numEntries);
  const quizzes = generateQuizzes(learningMaterials, numEntries);
  const engagements = generateEngagements(users, learningMaterials, numEntries);
  const feedbacks = generateFeedbacks(users, learningMaterials, numEntries);

  try {
    // Store data in collections
    await User.insertMany(users);
    await LearningMaterial.insertMany(learningMaterials);
    await Module.insertMany(modules);
    await Quiz.insertMany(quizzes);
    await Engagement.insertMany(engagements);
    await Feedback.insertMany(feedbacks);

    console.log("Data has been successfully stored in the database!");
  } catch (error) {
    console.error("Error storing data in the database:", error);
  } finally {
    mongoose.disconnect(); 
  }
};


seedDatabase();
