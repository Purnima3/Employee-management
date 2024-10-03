import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
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
  TablePagination,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

function LearningMaterial() {
  const [newLearningMaterial, setNewLearningMaterial] = useState({ title: '', description: '' });
  const [learningMaterials, setLearningMaterials] = useState([]);
  const [openLearningMaterialDialog, setOpenLearningMaterialDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page

  useEffect(() => {
    const fetchLearningMaterials = async () => {
      try {
        const response = await axios.get('http://localhost:3001/learning-materials/get-material');
        setLearningMaterials(response.data);
      } catch (error) {
        console.error('Error fetching learning materials:', error);
        toast.error('Failed to fetch learning materials.');
      }
    };

    fetchLearningMaterials();
  }, []);

  const handleAddLearningMaterial = async () => {
    try {
      const response = await axios.post('http://localhost:3001/learning-materials/create-material', newLearningMaterial);
      setLearningMaterials([...learningMaterials, response.data]);
      setOpenLearningMaterialDialog(false);
      toast.success('Learning material added successfully!');
      setNewLearningMaterial({ title: '', description: '' });
    } catch (error) {
      toast.error('Error adding learning material: ' + (error.response?.data?.message || error.message));
      console.error('Error adding learning material:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedMaterial) return;

    try {
      await axios.delete(`http://localhost:3001/learning-materials/delete-learning-material/${selectedMaterial._id}`);
      setLearningMaterials(learningMaterials.filter((material) => material._id !== selectedMaterial._id));
      setOpenDeleteDialog(false);
      setSelectedMaterial(null);
      toast.success('Learning material successfully deleted!');
    } catch (error) {
      toast.error('Error deleting learning material');
      console.error('Error deleting learning material:', error);
    }
  };

  const openDeleteConfirmation = (material) => {
    setSelectedMaterial(material);
    setOpenDeleteDialog(true);
  };

  // Filter learning materials based on the search query
  const filteredLearningMaterials = learningMaterials.filter((material) =>
    material.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <ToastContainer />
      <Typography variant="h6">Learning Materials</Typography>

      {/* Search Bar */}
      <TextField
        label="Search by Title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        sx={{ marginBottom: '1rem' }}
      />

      <Button variant="contained" onClick={() => setOpenLearningMaterialDialog(true)} sx={{ marginBottom: '1rem' }}>
        Add Learning Material
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLearningMaterials.length > 0 ? (
              filteredLearningMaterials.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((material) => (
                <TableRow key={material._id}>
                  <TableCell>{material.title}</TableCell>
                  <TableCell>{material.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => openDeleteConfirmation(material)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No learning materials found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredLearningMaterials.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0); // Reset page to 0 when rows per page changes
        }}
      />

      {/* Add Learning Material Dialog */}
      <Dialog open={openLearningMaterialDialog} onClose={() => setOpenLearningMaterialDialog(false)}>
        <DialogTitle>Add Learning Material</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={newLearningMaterial.title}
            onChange={(e) => setNewLearningMaterial({ ...newLearningMaterial, title: e.target.value })}
            fullWidth
            sx={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Description"
            value={newLearningMaterial.description}
            onChange={(e) => setNewLearningMaterial({ ...newLearningMaterial, description: e.target.value })}
            fullWidth
            sx={{ marginBottom: '1rem' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLearningMaterialDialog(false)}>Cancel</Button>
          <Button onClick={handleAddLearningMaterial}>Add Learning Material</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>Are you sure you want to delete this learning material?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LearningMaterial;
