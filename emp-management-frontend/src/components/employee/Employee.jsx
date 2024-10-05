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
import Feedback from './Feedback';
import Learning from './Learning';
import Discussio from './Discussion';
import Discussion from './Discussion';


const drawerWidth = 240;


function Employee() {
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
          <Typography variant="h6">Employee</Typography>
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
          <ListItem button onClick={() => setActiveSection('learnings')}>
            <ListItemIcon><LocalLibrary/></ListItemIcon>
            <ListItemText primary="learnings" />
          </ListItem>
          <ListItem button onClick={() => setActiveSection('feedback')}>
            <ListItemIcon><FeedbackIcon/></ListItemIcon>
            <ListItemText primary="feedback" />
          </ListItem>
          <ListItem button onClick={() => setActiveSection('discussion')}>
            <ListItemIcon><LocalLibrary/></ListItemIcon>
            <ListItemText primary="discussion" />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 14, marginTop: '44px' }}>
        {activeSection === 'learnings' && <Learning/>}
        {activeSection === 'discussion' && <Discussion/>}
        {activeSection === 'feedback' && <Feedback />}
      </Box>
    </Box>
  );
}

export default Employee;
