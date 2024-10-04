const Engagement = require('../models/Engagement');
const Feedback = require('../models/Feedback');
const LearningMaterial = require('../models/LearningMaterial');
const User = require('../models/user'); 


const getTopEmployees = async (req, res) => {
  try {
    const topEmployees = await Engagement.aggregate([
      {
        $group: {
          _id: '$userId', 
          totalScore: { $sum: '$quizScore' }, 
        },
      },
      {
        $sort: { totalScore: -1 }, 
      },
      {
        $limit: 10, 
      },
      {
        $lookup: {
          from: 'users', 
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails', 
      },
      {
        $project: {
          _id: 0, 
          userId: '$_id',
          firstName: '$userDetails.firstName',
          lastName: '$userDetails.lastName',
          totalScore: 1,
        },
      },
    ]);

    res.json(topEmployees);
  } catch (error) {
    console.error('Error fetching top employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller for department-wise average scores
const getDepartmentScores = async (req, res) => {
  try {
    const departmentScores = await Engagement.aggregate([
      {
        $lookup: {
          from: 'users', 
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails', 
      },
      {
        $group: {
          _id: '$userDetails.department', 
          averageScore: { $avg: '$quizScore' },
          totalScore: { $sum: '$quizScore' },  
          count: { $sum: 1 },                  
        },
      },
      {
        $project: {
          department: '$_id',
          averageScore: 1,
          totalScore: 1,
          count: 1,
        },
      },
    ]);

    res.json(departmentScores);
  } catch (error) {
    console.error('Error fetching department scores:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getTopFeedbackLearningMaterial = async (req, res) => {
  try {
    const topMaterialFeedbacks = await Feedback.aggregate([
      {
        $group: {
          _id: '$learningMaterialId', 
          totalFeedbacks: { $sum: 1 },
          averageRating: { $avg: '$rating' }, 
        },
      },
      {
        $sort: { totalFeedbacks: -1 }, 
      },
      {
        $limit: 1, 
      },
      {
        $lookup: {
          from: 'learningmaterials', 
          localField: '_id',
          foreignField: '_id',
          as: 'materialDetails',
        },
      },
      {
        $unwind: '$materialDetails', 
      },
      {
        $project: {
          _id: 0, 
          learningMaterialId: '$_id',
          title: '$materialDetails.title',
          totalFeedbacks: 1,
          averageRating: 1,
        },
      },
    ]);

    res.json(topMaterialFeedbacks);
  } catch (error) {
    console.error('Error fetching top feedback learning material:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getTopEmployees,
  getDepartmentScores,
  getTopFeedbackLearningMaterial,
};
