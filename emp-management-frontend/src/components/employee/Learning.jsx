// Learning.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../UserContext'; // Adjust the import path as necessary
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Learning() {
  const { user } = useUser(); // Access user from context
  const [learningMaterials, setLearningMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // Fetch all learning materials on component load
    const fetchLearningMaterials = async () => {
      try {
        const response = await axios.get('http://localhost:3001/learning-materials/get-materials-emp');
        setLearningMaterials(response.data);
        console.log('Learning Materials:', response.data); // Log the materials
      } catch (error) {
        console.error('Error fetching learning materials:', error);
      }
    };

    fetchLearningMaterials();
  }, []);

  // Function to handle search input changes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update the search term with the input value
  };

  // Filter learning materials based on the search term
  const filteredMaterials = learningMaterials.filter((material) =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectMaterial = (materialId) => {
    navigate(`/modules/${materialId}`); // Navigate to the module page with the selected material ID
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Learning Materials
      </Typography>

      {/* Search Input Field */}
      <TextField
        label="Search by Title"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange} // Update search term on input change
      />

      <Grid container spacing={2}>
        {filteredMaterials.map((material) => (
          <Grid item xs={12} sm={6} md={4} key={material._id}>
            <Card>
              <CardActionArea onClick={() => handleSelectMaterial(material._id)}>
                <CardContent>
                  <Typography variant="h5">{material.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {material.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Learning;
