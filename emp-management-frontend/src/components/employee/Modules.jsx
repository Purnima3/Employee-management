import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Button,
  Divider,
  Box,
} from '@mui/material';
import { useUser } from '../../UserContext'; // Adjust the import path as necessary

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

  useEffect(() => {
    const fetchModulesAndQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3001/modules/get-modules-emp/${id}?userId=${user.id}`,{
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
        modules.forEach((module) => {
          const isCompleted = engagement?.completedModules?.includes(module._id) || false;
          initialCompletionStatus[module._id] = isCompleted;
          if (isCompleted) completedCount += 1;
        });

        // Retrieve saved state from local storage
        const savedCompletionStatus = JSON.parse(localStorage.getItem('completionStatus')) || {};
        const savedQuizScore = localStorage.getItem('quizScore');
        const savedIsQuizCompleted = localStorage.getItem('isQuizCompleted') === 'true';

        setCompletionStatus({ ...initialCompletionStatus, ...savedCompletionStatus });
        setCompletedModulesCount(completedCount);
        setQuizScore(savedQuizScore ? parseInt(savedQuizScore, 10) : null);
        setIsQuizCompleted(savedIsQuizCompleted);

      } catch (error) {
        console.error('Error fetching modules and quiz:', error);
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
      },{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const updatedCompletionStatus = { ...completionStatus, [moduleId]: completed };
      setCompletionStatus(updatedCompletionStatus);
      setCompletedModulesCount((prev) => (completed ? prev + 1 : prev - 1));
      
      // Save completion status to local storage
      localStorage.setItem('completionStatus', JSON.stringify(updatedCompletionStatus));
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
      },{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      // Save quiz score and completion status to local storage
      localStorage.setItem('quizScore', score);
      localStorage.setItem('isQuizCompleted', true);
      
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
    <Container>
      <Typography variant="h5">Modules</Typography>
      <Typography variant="body1">Completion: {completionPercentage.toFixed(2)}%</Typography>
      <Divider style={{ margin: '20px 0' }} />
      <List>
        {modules.length > 0 ? (
          modules.map((module) => (
            <ListItem key={module._id}>
              <Checkbox
                checked={completionStatus[module._id] || false}
                onChange={(e) => handleModuleCompletion(module._id, e.target.checked)}
              />
              <ListItemText
                primary={
                  <Typography
                    component="a"
                    onClick={() => handleModuleClick(module._id, module.contentUrl)}
                    style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                  >
                    {module.title}
                  </Typography>
                }
              />
            </ListItem>
          ))
        ) : (
          <Typography>No modules available for this material.</Typography>
        )}
      </List>

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
                    <div key={optionIndex}>
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
                      {option}
                    </div>
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
  );
}

export default Module;
