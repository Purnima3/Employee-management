import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
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
  const [newLearningMaterial, setNewLearningMaterial] = useState({ 
    title: '', 
    description: '', 
    duration: undefined, 
    contentUrl: '', 
    department: '' 
  });
  const [learningMaterials, setLearningMaterials] = useState([]);
  const [openLearningMaterialDialog, setOpenLearningMaterialDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modules, setModules] = useState([]);
  const [newQuiz, setNewQuiz] = useState({ title: '', questions: [] });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch existing learning materials on mount
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

  // Handle adding new learning material along with modules and quiz
  const handleAddLearningMaterial = async () => {
    try {
      // Create learning material
      const response = await axios.post('http://localhost:3001/learning-materials/create-material', newLearningMaterial);
      
      // Create modules for the learning material
      const modulePromises = modules.map(module => axios.post('http://localhost:3001/modules/create-module', { 
        ...module, 
        learningMaterialId: response.data._id 
      }));
      
      const moduleResponses = await Promise.all(modulePromises);
      const createdModuleIds = moduleResponses.map(moduleResponse => moduleResponse.data._id);
    
      // Create quiz for the entire learning material
      const quizData = {
        title: newQuiz.title,
        questions: newQuiz.questions, 
        learningMaterialId: response.data._id,
      };
  
      const quizResponse = await axios.post('http://localhost:3001/quizzes/create-quiz', quizData);
    
      // Update the learning material with module and quiz IDs
      await axios.put(`http://localhost:3001/learning-materials/update-material/${response.data._id}`, {
        modules: createdModuleIds,
        quiz: quizResponse.data._id,
      });
    
      // Update UI state
      setLearningMaterials([...learningMaterials, { ...response.data, modules: createdModuleIds, quiz: quizResponse.data._id }]);
      setOpenLearningMaterialDialog(false);
      toast.success('Learning material added successfully!');
      setNewLearningMaterial({ title: '', description: '', department: '' });
      setModules([]);
      setNewQuiz({ title: '', questions: [] }); 
    } catch (error) {
      toast.error('Error adding learning material: ' + (error.response?.data?.message || error.message));
      console.error('Error adding learning material:', error);
    }
  };

  // Handle deletion of a learning material
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

  // Open delete confirmation dialog
  const openDeleteConfirmation = (material) => {
    setSelectedMaterial(material);
    setOpenDeleteDialog(true);
  };

  // Filter learning materials based on search query
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

      {/* Learning Materials Table */}
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
          setPage(0); 
        }}
      />

      {/* Add Learning Material Dialog */}
      <Dialog open={openLearningMaterialDialog} onClose={() => setOpenLearningMaterialDialog(false)}>
        <DialogTitle>Add Learning Material</DialogTitle>
        <DialogContent>
          {/* Learning Material Inputs */}
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
          
          {/* Department Dropdown */}
          <Select
            label="Department"
            value={newLearningMaterial.department}
            onChange={(e) => setNewLearningMaterial({ ...newLearningMaterial, department: e.target.value })}
            fullWidth
            sx={{ marginBottom: '1rem' }}
          >
            <MenuItem value="Data Science">Data Science</MenuItem>
            <MenuItem value="Data Engineering">Data Engineering</MenuItem>
            <MenuItem value="Full Stack">Full Stack</MenuItem>
          </Select>

          {/* Module Inputs */}
          <Typography variant="h6">Modules</Typography>
          {modules.map((module, index) => (
            <Box key={index} sx={{ marginBottom: '1rem' }}>
              <TextField
                label="Module Title"
                value={module.title}
                onChange={(e) => {
                  const updatedModules = [...modules];
                  updatedModules[index].title = e.target.value;
                  setModules(updatedModules);
                }}
                fullWidth
              />
              <TextField
                label="Module Description"
                value={module.description}
                onChange={(e) => {
                  const updatedModules = [...modules];
                  updatedModules[index].description = e.target.value;
                  setModules(updatedModules);
                }}
                fullWidth
              />
              <TextField
                label="Content URL"
                value={module.contentUrl}
                onChange={(e) => {
                  const updatedModules = [...modules];
                  updatedModules[index].contentUrl = e.target.value;
                  setModules(updatedModules);
                }}
                fullWidth
              />
              <Button
                variant="contained"
                color="error"
                onClick={() => setModules(modules.filter((_, i) => i !== index))}
              >
                Remove Module
              </Button>
            </Box>
          ))}
          <Button variant="contained" onClick={() => setModules([...modules, { title: '', description: '', contentUrl: '' }])}>
            Add Module
          </Button>

          {/* Quiz Inputs */}
          <Typography variant="h6">Quiz</Typography>
          <TextField
            label="Quiz Title"
            value={newQuiz.title}
            onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
            fullWidth
            sx={{ marginBottom: '1rem' }}
          />
          {newQuiz.questions.map((question, index) => (
            <Box key={index} sx={{ marginBottom: '1rem' }}>
              <TextField
                label={`Question ${index + 1}`}
                value={question.title}
                onChange={(e) => {
                  const updatedQuestions = [...newQuiz.questions];
                  updatedQuestions[index].title = e.target.value;
                  setNewQuiz({ ...newQuiz, questions: updatedQuestions });
                }}
                fullWidth
              />
              {question.options.map((option, optionIndex) => (
                <Box key={optionIndex} sx={{ marginLeft: '1rem', marginBottom: '0.5rem' }}>
                  <TextField
                    label={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => {
                      const updatedOptions = [...question.options];
                      updatedOptions[optionIndex] = e.target.value;
                      const updatedQuestions = [...newQuiz.questions];
                      updatedQuestions[index].options = updatedOptions;
                      setNewQuiz({ ...newQuiz, questions: updatedQuestions });
                    }}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      const updatedQuestions = [...newQuiz.questions];
                      updatedQuestions[index].options = question.options.filter((_, i) => i !== optionIndex);
                      setNewQuiz({ ...newQuiz, questions: updatedQuestions });
                    }}
                  >
                    Remove Option
                  </Button>
                </Box>
              ))}
              <Button
                variant="contained"
                onClick={() => {
                  const updatedQuestions = [...newQuiz.questions];
                  updatedQuestions[index].options.push(''); // Add an empty option
                  setNewQuiz({ ...newQuiz, questions: updatedQuestions });
                }}
              >
                Add Option
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setNewQuiz({ ...newQuiz, questions: newQuiz.questions.filter((_, i) => i !== index) })}
              >
                Remove Question
              </Button>
            </Box>
          ))}
          <Button variant="contained" onClick={() => setNewQuiz({ ...newQuiz, questions: [...newQuiz.questions, { title: '', options: [''] }] })}>
            Add Question
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLearningMaterialDialog(false)}>Cancel</Button>
          <Button onClick={handleAddLearningMaterial} variant="contained">Add Learning Material</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this learning material?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LearningMaterial;
