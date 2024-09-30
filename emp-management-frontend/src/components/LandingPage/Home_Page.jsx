import React from 'react'
import { Container, Typography, Button, Grid, Paper, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Home_Page() {
  return (
    <Container component="main" maxWidth="lg">
    <Grid container spacing={4} alignItems="center" justifyContent="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={6}>
        <Typography variant="h2" align="center" gutterBottom>
          Welcome to Book Review Central
        </Typography>
        <Typography variant="h5" align="center" paragraph>
          Discover your next favorite book and share your thoughts with our community. Explore book reviews, write your own, and connect with fellow readers.
        </Typography>
        <Box textAlign="center" mt={4}>
          <Button
            component={Link}
            to="/books"
            variant="contained"
            color="primary"
            size="large"
            style={{ marginRight: 16 }}
          >
            Explore Books
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            color="primary"
            size="large"
          >
            Sign In
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper elevation={3} style={{ padding: 16 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Latest Reviews
          </Typography>
          {/* Here you can map through recent reviews and display them */}
          <Typography variant="body1" align="center" paragraph>
            "An amazing read! The plot twists were unbelievable." - Jane Doe
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            "A must-read for anyone interested in historical fiction." - John Smith
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  </Container>
  )
}

export default Home_Page
