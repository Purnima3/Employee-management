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
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

function UserManagement() {
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', role: 'employee' });
  const [users, setUsers] = useState([]);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('http://localhost:3001/users/fetch-user');
      setUsers(response.data);
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      const response = await axios.post('http://localhost:3001/users/create-user', newUser);
      setUsers([...users, response.data]);
      setOpenUserDialog(false);
      toast.success('User added successfully!');
      setNewUser({ firstName: '', lastName: '', email: '', role: 'employee' });
    } catch (error) {
      toast.error('Error adding user');
      console.error('Error adding user:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await axios.delete(`http://localhost:3001/users/delete-user/${selectedUser._id}`);
      setUsers(users.filter((user) => user._id !== selectedUser._id));
      setOpenDeleteDialog(false);
      setSelectedUser(null);
      toast.success('User successfully deleted!');
    } catch (error) {
      toast.error('Error deleting user');
      console.error('Error deleting user:', error);
    }
  };

  const openDeleteConfirmation = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  return (
    <Box>
      <ToastContainer />
      <Typography variant="h6">Users</Typography>
      <Button variant="contained" onClick={() => setOpenUserDialog(true)} sx={{ marginBottom: '1rem' }}>Add User</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => openDeleteConfirmation(user)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add User Dialog */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            value={newUser.firstName}
            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
            fullWidth
            sx={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Last Name"
            value={newUser.lastName}
            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
            fullWidth
            sx={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            fullWidth
            sx={{ marginBottom: '1rem' }}
          />
          <FormControl fullWidth sx={{ marginBottom: '1rem' }}>
            <InputLabel>Role</InputLabel>
            <Select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
          <Button onClick={handleAddUser}>Add User</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>Are you sure you want to delete this user?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserManagement;
