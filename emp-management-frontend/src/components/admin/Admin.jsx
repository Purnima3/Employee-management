import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Home, Feedback as FeedbackIcon, People, LocalLibrary } from '@mui/icons-material';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import UserManagement from './UserManagement';
import LearningMaterialManagement from './LearningMaterial';
import FeedbackManagement from './FeedbackManagement';
import Dashboard from './Dashboard';

const drawerWidth = 240;

function Admin() {
  const [activeSection, setActiveSection] = useState('users');

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    window.location.href = '/login'; 
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <ToastContainer />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Admin Dashboard</Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <List>
        <ListItem button onClick={() => setActiveSection('dashboard')}>
            <ListItemIcon><Home/></ListItemIcon>
            <ListItemText primary="dashboard" />
          </ListItem>
          <ListItem button onClick={() => setActiveSection('users')}>
            <ListItemIcon><People /></ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button onClick={() => setActiveSection('learningMaterials')}>
            <ListItemIcon><LocalLibrary/></ListItemIcon>
            <ListItemText primary="Learning Materials" />
          </ListItem>
          <ListItem button onClick={() => setActiveSection('feedback')}>
            <ListItemIcon><FeedbackIcon/></ListItemIcon>
            <ListItemText primary="Feedback" />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 14,  marginTop: '64px' }}>
        {activeSection === 'users' && <UserManagement />}
        {activeSection === 'learningMaterials' && <LearningMaterialManagement />}
        {activeSection === 'feedback' && <FeedbackManagement />}
        {activeSection === 'dashboard' && <Dashboard />}
      </Box>
    </Box>
  );
}

export default Admin;
