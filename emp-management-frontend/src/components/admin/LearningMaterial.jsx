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
import { useUser } from '../../UserContext'; 

function LearningMaterial() {
  const [newLearningMaterial, setNewLearningMaterial] = useState({
    title: '',
    description: '',
    department: '',
  });
  const { user } = useUser(); // Access user from context
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
        const response = await axios.get('http://localhost:3001/learning-materials/get-material', {
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
  
      // **Create Learning Material**
      const response = await axios.post(
        'http://localhost:3001/learning-materials/create-material',
        newLearningMaterial,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const learningMaterialId = response.data._id;
  
      // **Create Modules**
      const modulePromises = modules.map((module) =>
        axios.post(
          'http://localhost:3001/modules/create-module',
          {
            ...module,
            learningMaterialId, // Link module to the learning material
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
      );
      const moduleResponses = await Promise.all(modulePromises);
      const createdModuleIds = moduleResponses.map((moduleResponse) => moduleResponse.data._id);
  
      // **Create Quiz**
      const quizData = {
        title: newQuiz.title,
        questions: newQuiz.questions.map((q) => ({
          question: q.question,
          options: q.options,
          answer: q.answer,
        })),
        learningMaterialId, // Link quiz to the learning material
      };
  
      const quizResponse = await axios.post(
        'http://localhost:3001/quizzes/create-quiz',
        quizData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      // **Link Modules and Quiz to Learning Material**
      await axios.put(
        `http://localhost:3001/learning-materials/update-material/${learningMaterialId}`,
        {
          modules: createdModuleIds, // Link created modules
          quiz: quizResponse.data._id, // Link created quiz
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
  
      // **Update State and UI**
      setLearningMaterials([...learningMaterials, { ...response.data, modules: createdModuleIds, quiz: quizResponse.data._id }]);
      setOpenLearningMaterialDialog(false);
      toast.success('Learning material and engagement entry added successfully!');
      setNewLearningMaterial({ title: '', description: '', department: '' });
      setModules([]); // Reset modules
      setNewQuiz({ title: '', questions: [{ question: '', options: ['', '', '', ''], answer: '' }] }); // Reset quiz
    } catch (error) {
      toast.error('Error adding learning material: ' + (error.response?.data?.message || error.message));
      console.error('Error adding learning material:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedMaterial) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/learning-materials/delete-learning-material/${selectedMaterial._id}`, {
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
              filteredLearningMaterials
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((material) => (
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
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />

      {/* Dialog for Adding Learning Material */}
      <Dialog open={openLearningMaterialDialog} onClose={() => setOpenLearningMaterialDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Learning Material</DialogTitle>
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
            multiline
            rows={3}
            sx={{ marginBottom: '1rem' }}
          />
          <Select
            value={newLearningMaterial.department}
            onChange={(e) => setNewLearningMaterial({ ...newLearningMaterial, department: e.target.value })}
            fullWidth
            displayEmpty
            sx={{ marginBottom: '1rem' }}
          >
            <MenuItem value="" disabled>
              Select Department
            </MenuItem>
            {departments.map((department, index) => (
              <MenuItem key={index} value={department}>
                {department}
              </MenuItem>
            ))}
          </Select>

          {/* Module Fields */}
          <Typography variant="h6" gutterBottom>
            Modules
          </Typography>
          {modules.map((module, index) => (
            <Box key={index} display="flex" alignItems="center" gap={2} sx={{ marginBottom: '1rem' }}>
              <TextField
                label={`Module ${index + 1} Title`}
                value={module.title}
                onChange={(e) => {
                  const newModules = [...modules];
                  newModules[index].title = e.target.value;
                  setModules(newModules);
                }}
                fullWidth
              />
              <TextField
                label="Content"
                value={module.content}
                onChange={(e) => {
                  const newModules = [...modules];
                  newModules[index].content = e.target.value;
                  setModules(newModules);
                }}
                fullWidth
                multiline
                rows={2}
              />
            </Box>
          ))}
          <Button variant="outlined" onClick={() => setModules([...modules, { title: '', content: '' }])}>
            Add Module
          </Button>

          {/* Quiz Section */}
          <Typography variant="h6" gutterBottom sx={{ marginTop: '1rem' }}>
            Quiz
          </Typography>
          <TextField
            label="Quiz Title"
            value={newQuiz.title}
            onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
            fullWidth
            sx={{ marginBottom: '1rem' }}
          />
          {newQuiz.questions.map((question, questionIndex) => (
            <Box key={questionIndex} sx={{ marginBottom: '1rem' }}>
              <TextField
                label={`Question ${questionIndex + 1}`}
                value={question.question}
                onChange={(e) => handleQuizQuestionChange(questionIndex, 'question', e.target.value)}
                fullWidth
                sx={{ marginBottom: '1rem' }}
              />
              {question.options.map((option, optionIndex) => (
                <TextField
                  key={optionIndex}
                  label={`Option ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                  fullWidth
                  sx={{ marginBottom: '0.5rem' }}
                />
              ))}
              <TextField
                label="Answer"
                value={question.answer}
                onChange={(e) => handleQuizQuestionChange(questionIndex, 'answer', e.target.value)}
                fullWidth
                sx={{ marginBottom: '1rem' }}
              />
            </Box>
          ))}
          <Button variant="outlined" onClick={handleAddQuestion}>
            Add Question
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLearningMaterialDialog(false)}>Cancel</Button>
          <Button onClick={handleAddLearningMaterial} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Delete Confirmation */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="xs">
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the learning material "{selectedMaterial?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LearningMaterial;
