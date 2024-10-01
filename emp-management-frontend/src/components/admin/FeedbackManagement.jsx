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

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const response = await axios.get('http://localhost:3001/feedbacks/all_feedback');
      setFeedbacks(response.data);
    };

    fetchFeedbacks();
  }, []);

  const handleDelete = async () => {
    if (!selectedFeedback) return;

    try {
      await axios.delete(`http://localhost:3001/feedbacks/delete-feedback/${selectedFeedback._id}`);
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
                <TableCell>{feedback.user}</TableCell>
                <TableCell>{feedback.comment}</TableCell>
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
