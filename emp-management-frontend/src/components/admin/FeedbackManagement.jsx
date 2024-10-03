import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const response = await axios.get('http://localhost:3001/feedback/get-all-feedback');
      setFeedbacks(response.data);
      
      // Fetch user details for each feedback
      const details = {};
      for (const feedback of response.data) {
        try {
          const userResponse = await axios.get(`http://localhost:3001/users/feedback/${feedback.userId}`);
          details[feedback.userId] = userResponse.data; // Store user details by userId
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
      setUserDetails(details); // Set the user details state
    };

    fetchFeedbacks();
  }, []);
 
  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/users/${userId}`); // Adjust the URL as necessary
      return response.data; // This will contain { firstName, lastName }
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error; // You can handle this error further up the call stack
    }
  };
  const handleDelete = async () => {
    if (!selectedFeedback) return;

    try {
      console.log(selectedFeedback._id)
      await axios.delete(`http://localhost:3001/feedback/delete-feedback/${selectedFeedback._id}`);

      setFeedbacks(feedbacks.filter((feedback) => feedback._id !== selectedFeedback._id));
      setOpenDeleteDialog(false);
      setSelectedFeedback(null);
      toast.success('Feedback successfully deleted!');
    } catch (error) {
      toast.error('Error deleting feedback');
      console.error('Error deleting feedback:', error);
    }
  };

  const openDeleteConfirmation = (feedback) => {
    setSelectedFeedback(feedback);
    setOpenDeleteDialog(true);
  };

  return (
    <Box>
      <ToastContainer />
      <Typography variant="h6">Feedback</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbacks.map((feedback) => (
              <TableRow key={feedback._id}>
                <TableCell>{feedback._id}</TableCell>
                <TableCell>{userDetails[feedback.userId] ? `${userDetails[feedback.userId].firstName} ${userDetails[feedback.userId].lastName}` : 'Loading...'}</TableCell>
                <TableCell>{feedback.feedback}</TableCell>
                <TableCell>{feedback.rating}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => openDeleteConfirmation(feedback)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>Are you sure you want to delete this feedback?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FeedbackManagement;
