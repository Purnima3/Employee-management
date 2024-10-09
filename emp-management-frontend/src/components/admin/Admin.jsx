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
import { ToastContainer } from 'react-toastify';
import UserManagement from './UserManagement';
import LearningMaterialManagement from './LearningMaterial';
import FeedbackManagement from './FeedbackManagement';
import Dashboard from './Dashboard';
import { useUser } from '../../UserContext'; 

const drawerWidth = 240;

function Admin() {
  const { user } = useUser();
  // Initialize activeSection from localStorage or default to 'dashboard'
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('activeSection') || 'dashboard';
  });

  // Store activeSection in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('activeSection'); // Remove activeSection on logout
    window.location.href = '/login';
  };

  
  return (
    <Box sx={{ display: 'flex' }}>
      <ToastContainer />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Admin Dashboard</Typography>
          {/* Profile Info */}
          <Typography variant="body1" color="inherit">
            {user.email} ({user.role})
          </Typography>
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
            <ListItemText primary="Dashboard" />
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
          {/* Logout Button in Drawer */}
          <ListItem>
            <Button 
              variant="contained" 
              color="secondary" 
              fullWidth 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 14, marginTop: '44px' }}>
        {activeSection === 'dashboard' && <Dashboard />}
        {activeSection === 'users' && <UserManagement />}
        {activeSection === 'learningMaterials' && <LearningMaterialManagement />}
        {activeSection === 'feedback' && <FeedbackManagement />}
      </Box>
    </Box>
  );
}

export default Admin;
