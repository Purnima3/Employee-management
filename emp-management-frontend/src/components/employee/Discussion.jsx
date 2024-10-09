import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Grid,
  Box,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { useUser } from '../../UserContext';

const Discussion = () => {
  const { user } = useUser(); // Access user from context
  const [learningMaterials, setLearningMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [discussion, setDiscussion] = useState('');
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearningMaterials = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3001/learning-materials/get/${user.department}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLearningMaterials(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching learning materials:', error);
      }
    };

    fetchLearningMaterials();
  }, [user.department]);

  const handleMaterialChange = (event) => {
    setSelectedMaterial(event.target.value);
    // Fetch discussions for the selected material here
    fetchDiscussions(event.target.value);
  };

  const fetchDiscussions = async (materialId) => {
    try {
      const response = await axios.get(`http://localhost:3001/discussions/${materialId}`);
      setDiscussions(response.data);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    }
  };

  const handleDiscussionSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3001/discussions/create',
        {
          userId: user.id,
          materialId: selectedMaterial,
          discussion,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDiscussion('');
      fetchDiscussions(selectedMaterial); // Refresh discussions
    } catch (error) {
      console.error('Error submitting discussion:', error);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        Discussion Section
      </Typography>

      {/* Learning Material Selector */}
      <FormControl fullWidth margin="normal" variant="outlined">
        <InputLabel>Learning Material</InputLabel>
        <Select value={selectedMaterial} onChange={handleMaterialChange} label="Learning Material">
          {learningMaterials.map((material) => (
            <MenuItem key={material._id} value={material._id}>
              {material.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Discussion Form */}
      <form onSubmit={handleDiscussionSubmit}>
        <TextField
          fullWidth
          label="Share your thoughts..."
          variant="outlined"
          value={discussion}
          onChange={(e) => setDiscussion(e.target.value)}
          margin="normal"
          multiline
          rows={3}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Post Discussion
        </Button>
      </form>

      {/* Discussions Section */}
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {discussions.map((item) => (
          <Grid item xs={12} key={item._id}>
            <Box
              component={Paper}
              elevation={3}
              padding={2}
              maxWidth="75%"
              marginLeft={user.id === item.userId ? 'auto' : 0} // Right-align user's posts
              marginRight={user.id === item.userId ? 0 : 'auto'} // Left-align others' posts
              bgcolor={user.id === item.userId ? 'rgba(63, 81, 181, 0.1)' : 'rgba(200, 200, 200, 0.2)'} // Lighter colors
              color={user.id === item.userId ? 'rgba(63, 81, 181, 0.8)' : 'text.primary'}
              borderRadius={4}
            >
              <Typography variant="body1" gutterBottom>
                {item.content}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.id === item.userId ? 'You' : `Posted by ${item.userEmail}`} &bull; {new Date(item.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Discussion;
