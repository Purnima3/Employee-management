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

  useEffect(() => {
    const fetchModulesAndQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/modules/get-modules-emp/${id}`);
        setModules(response.data.modules);
        setQuiz(response.data.quiz);
        
        // Initialize completion status and count
        const initialCompletionStatus = {};
        response.data.modules.forEach((module) => {
          initialCompletionStatus[module._id] = false; // Initialize all modules as not completed
        });
        setCompletionStatus(initialCompletionStatus);
      } catch (error) {
        console.error('Error fetching modules and quiz:', error);
      }
    };

    fetchModulesAndQuiz();
  }, [id]);

  const handleModuleCompletion = async (moduleId, completed) => {
    console.log( user._id)
    try {
      console.log( user._id)
      await axios.put('http://localhost:3001/engagement/update', {
       
        userId: user._id,
        learningMaterialId: id,
        moduleId,
        completed,
      });

      // Update completion status
      setCompletionStatus((prev) => ({ ...prev, [moduleId]: completed }));

      // Update the count of completed modules
      setCompletedModulesCount((prev) => (completed ? prev + 1 : prev - 1));
    } catch (error) {
      console.error('Error updating module completion:', error);
    }
  };

  const handleModuleClick = (moduleId, url) => {
    // Mark the module as completed when clicked
    handleModuleCompletion(moduleId, true);

    // Open the module content in a new tab
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
      await axios.put('http://localhost:3001/engagement/update', {
        userId: user._id,
        learningMaterialId: id,
        quizScore: score,
      });
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
        </Box>
      )}
    </Container>
  );
}

export default Module;
