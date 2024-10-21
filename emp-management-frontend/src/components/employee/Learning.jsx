import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../UserContext'; 
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  TextField,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Learning() {
  const { user } = useUser(); 
  const [learningMaterials, setLearningMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchLearningMaterials = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3001/learning-materials/get-materials-emp', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        const filteredMaterials = response.data.filter(material => material.department === user.department);
        setLearningMaterials(filteredMaterials);
        console.log('Learning Materials:', filteredMaterials); 
      } catch (error) {
        console.error('Error fetching learning materials:', error);
      }
    };

    fetchLearningMaterials();
  }, [user.department]);

  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); 
  };

 
  const filteredMaterials = learningMaterials.filter((material) =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectMaterial = async (materialId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3001/engagement/this/create-engagement',
        {
          learningMaterialId: materialId,
          userId: user.id, 
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

      if (response.status === 201) {
        console.log('Engagement created successfully:', response.data);
        navigate(`/modules/${materialId}`);
      } else {
        console.error('Failed to create engagement:', response.data.message);
      }
    } catch (error) {
      console.error('Error creating engagement:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center" sx={{ marginBottom: 4 }}>
        Learning Materials
      </Typography>

      {/* Search Input Field */}
      <TextField
        label="Search by Title"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange} 
        sx={{
          backgroundColor: 'white',
          borderRadius: '4px',
        }}
      />

      <Grid container spacing={4}>
        {filteredMaterials.map((material) => (
          <Grid item xs={12} sm={6} md={4} key={material._id}>
            <Card
             elevation={4}
             sx={{
               height: '100%', 
               transition: 'transform 0.2s, box-shadow 0.2s',
               '&:hover': {
                 transform: 'scale(1.05)',
                 boxShadow: 8,
               },
             }}
            >
              <CardActionArea onClick={() => handleSelectMaterial(material._id)}>
                <CardContent
                  sx={{
                    minHeight: '150px', 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="h5" sx={{ color: 'primary.main' }}>
                    {material.title}
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: 1}}>
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
