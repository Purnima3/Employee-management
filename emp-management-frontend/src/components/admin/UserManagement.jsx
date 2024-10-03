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
  TablePagination,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users/fetch-user');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  const generateRandomPassword = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleAddUser = async () => {
    const password = generateRandomPassword();
    const userToAdd = { ...newUser, password };

    try {
      await axios.post('http://localhost:3001/users/create-user', userToAdd);
      await axios.post('http://localhost:3001/users/send-email', { email: userToAdd.email, password });

      setNewUser({ firstName: '', lastName: '', email: '', role: 'employee' });
      setOpenUserDialog(false);
      
      const response = await axios.get('http://localhost:3001/users/fetch-user');
      setUsers(response.data);
      toast.success('User added successfully!');
    } catch (error) {
      toast.error('Error adding user: ' + (error.response?.data?.message || error.message));
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

  // Filter users based on the search query
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <ToastContainer />
      <Typography variant="h6">Users</Typography>

      {/* Search Bar */}
      <TextField
        label="Search by Email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        sx={{ marginBottom: '1rem' }}
      />

      <Button variant="contained" onClick={() => setOpenUserDialog(true)} sx={{ marginBottom: '1rem' }}>
        Add User
      </Button>

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
            {filteredUsers.length > 0 ? (
              filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No users found.
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
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0); // Reset page to 0 when rows per page changes
        }}
      />

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
