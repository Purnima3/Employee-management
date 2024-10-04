const mongoose = require("mongoose");
const { faker } = require('@faker-js/faker');
const connectDB = require('../config/db');
const User = require("../models/user");
const LearningMaterial = require("../models/LearningMaterial");
const Module = require("../models/module");
const Quiz = require("../models/Quiz");
const Feedback = require("../models/Feedback");
const Engagement = require("../models/Engagement");

const generateFakeUsers = async (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "employee",
      department: faker.helpers.arrayElement(["Data Science", "Data Engineering", "Full Stack"]),
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
      duration: faker.number.int({ min: 30, max: 180 }), 
      contentUrl: faker.internet.url(),
      department: faker.helpers.arrayElement(["Data Science", "Data Engineering", "Full Stack"]),
    });
  }
  await LearningMaterial.insertMany(materials);
  console.log(`${count} learning materials inserted`);
};

const generateFakeModules = async (count) => {
  const materials = await LearningMaterial.find();
  const modules = [];
  for (let i = 0; i < count; i++) {
    modules.push({
      title: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      contentUrl: faker.internet.url(),
      learningMaterialId: faker.helpers.arrayElement(materials)._id, 
    });
  }
  await Module.insertMany(modules);
  console.log(`${count} modules inserted`);
};


const generateFakeQuizzes = async (count) => {
  const materials = await LearningMaterial.find();
  const quizzes = [];
  for (let i = 0; i < count; i++) {
    const questions = [];
    for (let j = 0; j < 4; j++) { 
      questions.push({
        question: faker.lorem.sentence(),
        options: [faker.lorem.word(), faker.lorem.word(), faker.lorem.word(), faker.lorem.word()],
        answer: faker.helpers.arrayElement(["Option 1", "Option 2", "Option 3", "Option 4"]),
      });
    }
    quizzes.push({
      title: faker.commerce.productName(),
      questions: questions,
      learningMaterialId: faker.helpers.arrayElement(materials)._id,
    });
  }
  await Quiz.insertMany(quizzes);
  console.log(`${count} quizzes inserted`);
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
      timeSpent: faker.number.int({ min: 0, max: 300 }), 
      quizScore: faker.number.int({ min: 0, max: 100 }),
      moduleCompletion: [{ 
        moduleId: new mongoose.Types.ObjectId(), 
        completed: faker.datatype.boolean(), 
      }],
    });
  }
  await Engagement.insertMany(engagements);
  console.log(`${count} engagements inserted`);
};


// Function to populate the database
const populateDB = async () => {
  await connectDB();

  try {
    await generateFakeUsers(1000);
    await generateFakeLearningMaterials(1000);
    await generateFakeModules(1000);
    await generateFakeQuizzes(1000);
    await generateFakeFeedback(1000);
    await generateFakeEngagements(1000);
    console.log("Database populated successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    mongoose.connection.close();
  }
};

populateDB();
