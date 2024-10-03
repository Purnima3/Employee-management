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
  CircularProgress,
  TablePagination,
  TextField,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // Added search query state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/feedback/get-all-feedback');
        setFeedbacks(response.data);

        const userIds = response.data.map((feedback) => feedback.userId);
        const uniqueUserIds = [...new Set(userIds)];

        const userDetailsPromises = uniqueUserIds.map(async (userId) => {
          try {
            const userResponse = await axios.get(`http://localhost:3001/users/feedback/${userId}`);
            return { userId, userData: userResponse.data };
          } catch (error) {
            console.error('Error fetching user details:', error);
            return { userId, userData: null };
          }
        });

        const userDetailsResults = await Promise.all(userDetailsPromises);
        const details = userDetailsResults.reduce((acc, { userId, userData }) => {
          acc[userId] = userData;
          return acc;
        }, {});

        setUserDetails(details);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        toast.error('Failed to fetch feedbacks.');
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleDelete = async () => {
    if (!selectedFeedback) return;

    try {
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

  // Filter feedback based on the search query
  const filteredFeedbacks = feedbacks.filter((feedback) =>
    feedback.feedback.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <ToastContainer />
      <Typography variant="h6">Feedback</Typography>

      {/* Search Bar */}
      <TextField
        label="Search Feedback"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        sx={{ marginBottom: '1rem' }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>User</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Comment</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Rating</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFeedbacks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((feedback, index) => {
             

                return (
                  <TableRow key={feedback._id} >
                    <TableCell>{feedback._id}</TableCell>
                    <TableCell>
                      {userDetails[feedback.userId]
                        ? `${userDetails[feedback.userId].firstName} ${userDetails[feedback.userId].lastName}`
                        : 'User data unavailable'}
                    </TableCell>
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
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredFeedbacks.length} // Use filtered feedback count
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0); // Reset page to 0 when rows per page changes
        }}
      />

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
