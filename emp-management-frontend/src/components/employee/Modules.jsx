import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  ListItemText,
  Checkbox,
  Button,
  Divider,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
} from '@mui/material';
import { useUser } from '../../UserContext'; // Adjust the import path as necessary
import Layout from './Layout/Layout';
import CompletionPercentage from './CompletionPercentage'; // Adjust the import path as necessary

function Module() {
  const { id } = useParams(); // Get the learning material ID from the URL
  const { user } = useUser(); // Access user from context
  const [modules, setModules] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [completionStatus, setCompletionStatus] = useState({}); // Track module completion
  const [completedModulesCount, setCompletedModulesCount] = useState(0); // Track completed modules
  const [quizScore, setQuizScore] = useState(null); // Track user's quiz score
  const [isQuizCompleted, setIsQuizCompleted] = useState(false); // Track if quiz is completed
  const [loading, setLoading] = useState(true); // Loading state

  // Helper function to generate a unique key for local storage
  const generateLocalStorageKey = (key) => `${user.id}_${id}_${key}`;

  useEffect(() => {
    const fetchModulesAndQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3001/modules/get-modules-emp/${id}?userId=${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        const { modules, quiz, engagement } = response.data;

        setModules(modules);
        setQuiz(quiz);

        // Initialize completion status based on engagement data
        const initialCompletionStatus = {};
        let completedCount = 0;

        // Retrieve saved state from local storage for this specific learning material
        const savedCompletionStatus = JSON.parse(localStorage.getItem(generateLocalStorageKey('completionStatus'))) || {};

        modules.forEach((module) => {
          const isCompleted = savedCompletionStatus[module._id] !== undefined 
            ? savedCompletionStatus[module._id]
            : engagement?.completedModules?.includes(module._id) || false;

          initialCompletionStatus[module._id] = isCompleted;
          if (isCompleted) completedCount += 1;
        });

        setCompletionStatus(initialCompletionStatus);
        setCompletedModulesCount(completedCount);
        
        const savedQuizScore = localStorage.getItem(generateLocalStorageKey('quizScore'));
        const savedIsQuizCompleted = localStorage.getItem(generateLocalStorageKey('isQuizCompleted')) === 'true';

        setQuizScore(savedQuizScore ? parseInt(savedQuizScore, 10) : null);
        setIsQuizCompleted(savedIsQuizCompleted);

      } catch (error) {
        console.error('Error fetching modules and quiz:', error);
      } finally {
        setLoading(false); // Set loading to false when data is fetched
      }
    };

    fetchModulesAndQuiz();
  }, [id, user.id]);

  const handleModuleCompletion = async (moduleId, completed) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3001/engagement/update', {
        userId: user.id,
        learningMaterialId: id,
        moduleId,
        completed,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const updatedCompletionStatus = { ...completionStatus, [moduleId]: completed };
      setCompletionStatus(updatedCompletionStatus);
      setCompletedModulesCount((prev) => (completed ? prev + 1 : prev - 1));

      // Save completion status to local storage for this specific learning material
      localStorage.setItem(generateLocalStorageKey('completionStatus'), JSON.stringify(updatedCompletionStatus));
    } catch (error) {
      console.error('Error updating module completion:', error);
    }
  };

  const handleModuleClick = (moduleId, url) => {
    handleModuleCompletion(moduleId, true);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleQuizSubmit = async () => {
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (quizAnswers[index] === question.answer) {
        score += 1;
      }
    });

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3001/engagement/update', {
        userId: user.id,
        learningMaterialId: id,
        quizScore: score,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      // Save quiz score and completion status to local storage for this specific learning material
      localStorage.setItem(generateLocalStorageKey('quizScore'), score);
      localStorage.setItem(generateLocalStorageKey('isQuizCompleted'), true);

      setQuizScore(score);
      setIsQuizCompleted(true);
      alert(`Quiz submitted! Your score is ${score}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  // Calculate completion percentage
  const completionPercentage = modules.length > 0 ? (completedModulesCount / modules.length) * 100 : 0;

  return (
    <Layout>
      <Container>
        <Typography variant="h5" gutterBottom>Modules</Typography>
        
        {/* Completion Percentage Display */}
        <CompletionPercentage modules={modules} completedModulesCount={completedModulesCount} />

        <Divider style={{ margin: '20px 0' }} />
        
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {modules.length > 0 ? (
              modules.map((module) => (
                <Grid item xs={12} sm={6} md={4} key={module._id}>
                  <Card
                    variant="outlined"
                    sx={{
                      boxShadow: 2,
                      backgroundColor: completionStatus[module._id] ? '#e0f7fa' : 'white',
                      transition: 'background-color 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        backgroundColor: '#f1f8e9',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent>
                      <Checkbox
                        checked={completionStatus[module._id] || false}
                        onChange={(e) => handleModuleCompletion(module._id, e.target.checked)}
                      />
                      <ListItemText
                        primary={
                          <Typography
                            component="a"
                            onClick={() => handleModuleClick(module._id, module.contentUrl)}
                            style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue', fontWeight: 'bold' }}
                          >
                            {module.title}
                          </Typography>
                        }
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>No modules available for this material.</Typography>
            )}
          </Grid>
        )}

        {quiz && (
          <Box mt={3}>
            <Typography variant="h6">Quiz: {quiz.title}</Typography>
            {isQuizCompleted ? (
              <Typography>Your quiz score: {quizScore}</Typography>
            ) : (
              <>
                {quiz.questions.map((question, index) => (
                  <Box key={index} mb={2}>
                    <Typography variant="body1">{question.question}</Typography>
                    {question.options.map((option, optionIndex) => (
                      <Box key={optionIndex} display="flex" alignItems="center">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          onChange={() => setQuizAnswers((prev) => {
                            const updatedAnswers = [...prev];
                            updatedAnswers[index] = option;
                            return updatedAnswers;
                          })}
                        />
                        <Typography variant="body2" ml={1}>
                          {option}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ))}
                <Button variant="contained" color="primary" onClick={handleQuizSubmit}>
                  Submit Quiz
                </Button>
              </>
            )}
          </Box>
        )}
      </Container>
    </Layout>
  );
}

export default Module;
