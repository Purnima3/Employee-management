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
    department: '',
  });
  const [learningMaterials, setLearningMaterials] = useState([]);
  const [openLearningMaterialDialog, setOpenLearningMaterialDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modules, setModules] = useState([]);
  const [departments, setDepartments] = useState(['Data Science', 'Data Engineering', 'Full Stack']);
  const [selectedDepartment, setSelectedDepartment] = useState('');


  const [newQuiz, setNewQuiz] = useState({
    title: '',
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        answer: '',
      },
    ],
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchLearningMaterials = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/learning-materials/get-material',{
          headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json',
          },
        });
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
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3001/learning-materials/create-material', newLearningMaterial,{
        headers: {
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
      });

      const learningMaterialId = response.data._id;

      const modulePromises = modules.map((module) =>
        axios.post('http://localhost:3001/modules/create-module', {
          ...module,
          learningMaterialId,
        },{
          headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json',
          },
        })
      );

      const moduleResponses = await Promise.all(modulePromises);
      const createdModuleIds = moduleResponses.map((moduleResponse) => moduleResponse.data._id);

      const quizData = {
        title: newQuiz.title,
        questions: newQuiz.questions.map((q) => ({
          question: q.question,
          options: q.options,
          answer: q.answer,
        })),
        learningMaterialId,
      };

      const quizResponse = await axios.post('http://localhost:3001/quizzes/create-quiz', quizData,{
        headers: {
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
      });

    
      await axios.put(`http://localhost:3001/learning-materials/update-material/${learningMaterialId}`, {
        modules: createdModuleIds,
        quiz: quizResponse.data._id,
      },{
        headers: {
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
      });

  
      setLearningMaterials([...learningMaterials, { ...response.data, modules: createdModuleIds, quiz: quizResponse.data._id }]);
      setOpenLearningMaterialDialog(false);
      toast.success('Learning material added successfully!');
      setNewLearningMaterial({ title: '', description: '', department: '' });
      setModules([]);
      setNewQuiz({ title: '', questions: [{ question: '', options: ['', '', '', ''], answer: '' }] });
    } catch (error) {
      toast.error('Error adding learning material: ' + (error.response?.data?.message || error.message));
      console.error('Error adding learning material:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedMaterial) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/learning-materials/delete-learning-material/${selectedMaterial._id}`,{
        headers: {
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
      });
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

  const filteredLearningMaterials = learningMaterials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!selectedDepartment || material.department === selectedDepartment)
  );

  const handleQuizQuestionChange = (index, field, value) => {
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions[index][field] = value;
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };
  
  const handleAddQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [
        ...newQuiz.questions,
        {
          question: '',
          options: ['', '', '', ''],
          answer: '',
        },
      ],
    });
  };
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  return (
    <Box>
      <ToastContainer />

      {/* Search Bar and Department Filter */}
      <Box display="flex" alignItems="center" gap={2} sx={{ marginBottom: '1rem' }}>
        <TextField
          label="Search by Title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
        <Select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          displayEmpty
          sx={{ minWidth: '150px' }}
        >
          <MenuItem value="">All Departments</MenuItem>
          {departments.map((department, index) => (
            <MenuItem key={index} value={department}>
              {department}
            </MenuItem>
          ))}
        </Select>
      </Box>

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
              <TableCell>Department</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLearningMaterials.length > 0 ? (
              filteredLearningMaterials.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((material) => (
                <TableRow key={material._id}>
                  <TableCell>{material.title}</TableCell>
                  <TableCell>{material.description}</TableCell>
                  <TableCell>{material.department}</TableCell>
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
                <TableCell colSpan={4} align="center">
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
            {departments.map((department, index) => (
              <MenuItem key={index} value={department}>
                {department}
              </MenuItem >   ))}</Select>

              {/* Quiz Inputs */}
              <Typography variant="subtitle1">Quiz</Typography>
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
      value={question.question}
      onChange={(e) => handleQuizQuestionChange(index, 'question', e.target.value)}
      fullWidth
    />
    {question.options.map((option, optIndex) => (
      <TextField
        key={optIndex}
        label={`Option ${optIndex + 1}`}
        value={option}
        onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
        fullWidth
        sx={{ marginTop: '0.5rem' }}
      />
    ))}
    <TextField
      label="Answer"
      value={question.answer}
      onChange={(e) => handleQuizQuestionChange(index, 'answer', e.target.value)}
      fullWidth
      sx={{ marginTop: '0.5rem' }}
    />
  </Box>
))}
      <Button variant="contained" onClick={handleAddQuestion} sx={{ marginTop: '1rem' }}>
  Add Question
</Button>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpenLearningMaterialDialog(false)}>Cancel</Button>
      <Button onClick={handleAddLearningMaterial}>Add</Button>
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
      <Button onClick={handleDelete} color="error">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
</Box>
); }

export default LearningMaterial;
