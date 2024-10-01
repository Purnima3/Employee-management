import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Home, Assessment, Feedback as FeedbackIcon } from '@mui/icons-material';
import axios from 'axios';
import { useUser } from '../../UserContext'; 

const drawerWidth = 240; // Sidebar width

function Employee() {
  const [learningMaterials, setLearningMaterials] = useState([]);
  const [quizScores, setQuizScores] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState([]);
  const [activeSection, setActiveSection] = useState('learningMaterials'); // Track active section
  const { user } = useUser(); // Access user from context

  useEffect(() => {
    const fetchLearningMaterials = async () => {
      const response = await axios.get('http://localhost:3001/learning-materials');
      setLearningMaterials(response.data);
    };

    const fetchQuizScores = async () => {
      // Ensure userId is obtained from context
      const userId = user?.id; // Assume user object has an id property
      if (userId) {
        const response = await axios.get(`http://localhost:3001/engagement/${userId}`);
        setQuizScores(response.data);
      }
    };

    fetchLearningMaterials();
    fetchQuizScores();
  }, [user]); // Dependency on user context

  const handleFeedbackSubmit = async () => {
    const userId = user?.id; // Get user ID from context
    const materialId = 'yourSelectedMaterialId'; // Replace with the actual selected material ID

    if (feedback && userId) {
      try {
        await axios.post('http://localhost:3001/feedback', { userId, materialId, feedback });
        setSubmittedFeedback([...submittedFeedback, { materialId, feedback }]);
        setFeedback('');
      } catch (error) {
        console.error('Error submitting feedback', error);
      }
    }
  };

  // Sidebar toggle function
  const toggleSection = (section) => {
    setActiveSection(section);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">Employee Dashboard</Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <List>
          <ListItem button onClick={() => toggleSection('learningMaterials')}>
            <ListItemIcon><Home /></ListItemIcon>
            <ListItemText primary="Learning Materials" />
          </ListItem>
          <ListItem button onClick={() => toggleSection('quizScores')}>
            <ListItemIcon><Assessment /></ListItemIcon>
            <ListItemText primary="Quiz Scores" />
          </ListItem>
          <ListItem button onClick={() => toggleSection('feedback')}>
            <ListItemIcon><FeedbackIcon /></ListItemIcon>
            <ListItemText primary="Provide Feedback" />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginLeft: `${drawerWidth}px`, marginTop: '64px' }}>
        {activeSection === 'learningMaterials' && (
          <Box sx={{ marginBottom: '2rem' }}>
            <Typography variant="h6" gutterBottom>
              Learning Materials Engagement
            </Typography>
            {learningMaterials.map((material) => (
              <Paper key={material._id} sx={{ padding: '1rem', marginBottom: '1rem' }}>
                <Typography variant="h6">{material.title}</Typography>
                <Typography variant="body1">{material.description}</Typography>
                <Typography variant="body2">Time Spent: {Math.floor(Math.random() * 100)} mins</Typography>
              </Paper>
            ))}
          </Box>
        )}

        {activeSection === 'quizScores' && (
          <Box sx={{ marginBottom: '2rem' }}>
            <Typography variant="h6" gutterBottom>
              Quiz Scores
            </Typography>
            {quizScores.map((quiz) => (
              <Paper key={quiz.materialId._id} sx={{ padding: '1rem', marginBottom: '1rem' }}>
                <Typography variant="h6">{quiz.materialId.title}</Typography>
                <Typography variant="body2">Score: {quiz.score}</Typography>
              </Paper>
            ))}
          </Box>
        )}

        {activeSection === 'feedback' && (
          <Box sx={{ marginBottom: '2rem' }}>
            <Typography variant="h6" gutterBottom>
              Provide Feedback
            </Typography>
            <TextField
              label="Feedback"
              multiline
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleFeedbackSubmit} sx={{ marginTop: '1rem' }}>
              Submit Feedback
            </Button>

            {/* Display Submitted Feedback */}
            {submittedFeedback.length > 0 && (
              <Box sx={{ marginTop: '2rem' }}>
                <Typography variant="h6" gutterBottom>
                  Submitted Feedback
                </Typography>
                {submittedFeedback.map((item, index) => {
                  const material = learningMaterials.find((mat) => mat._id === item.materialId);
                  return (
                    <Paper key={index} sx={{ padding: '1rem', marginBottom: '1rem' }}>
                      <Typography variant="body1"><strong>{material?.title}</strong></Typography>
                      <Typography variant="body2">{item.feedback}</Typography>
                    </Paper>
                  );
                })}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Employee;
