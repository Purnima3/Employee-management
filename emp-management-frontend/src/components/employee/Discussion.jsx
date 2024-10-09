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
  List,
  ListItem,
  ListItemText,
  CircularProgress,
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
      <Typography variant="h4" gutterBottom>
        Discussion Section
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Learning Material</InputLabel>
        <Select value={selectedMaterial} onChange={handleMaterialChange}>
          {learningMaterials.map((material) => (
            <MenuItem key={material._id} value={material._id}>
              {material.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <form onSubmit={handleDiscussionSubmit}>
        <TextField
          fullWidth
          label="Your Discussion"
          variant="outlined"
          value={discussion}
          onChange={(e) => setDiscussion(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Submit Discussion
        </Button>
      </form>
      <List>
        {discussions.map((item) => (
          <ListItem key={item._id}>
            <ListItemText primary={item.discussion} secondary={`Posted by ${item.userId.firstName} ${item.userId.lastName}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Discussion;
