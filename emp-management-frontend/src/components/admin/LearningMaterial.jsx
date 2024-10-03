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

  useEffect(() => {
    const fetchLearningMaterials = async () => {
      const response = await axios.get('http://localhost:3001/learning-materials/get-material');
      setLearningMaterials(response.data);
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
      toast.error('Error adding learning material');
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

  return (
    <Box>
      <ToastContainer />
      <Typography variant="h6">Learning Materials</Typography>
      <Button variant="contained" onClick={() => setOpenLearningMaterialDialog(true)} sx={{ marginBottom: '1rem' }}>Add Learning Material</Button>
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
            {learningMaterials.map((material) => (
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      
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
