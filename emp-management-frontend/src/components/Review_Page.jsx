import React from 'react';
import { Container, Typography, Button, TextField, Paper } from '@mui/material';



function Review_Page() {
  return (
    <Container component="main" maxWidth="xs">
    <Paper elevation={3} style={{ padding: 20 }}>
      <Typography variant="h5">Book Review</Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="book-title"
        label="Book Title"
        name="book-title"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="review"
        label="Review"
        name="review"
        multiline
        rows={4}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
      >
        Submit Review
      </Button>
    </Paper>
  </Container>
  )
}

export default Review_Page
