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
import Feedback from './Feedback';
import Learning from './Learning';
import Discussion from './Discussion';
import { useUser } from '../../UserContext'; 

const drawerWidth = 240;

function Employee() {
  const { user } = useUser(); 
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('activeSection') || 'learnings';
  });

 
  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('activeSection'); 
    window.location.href = '/login';
  };

  

  return (
    <Box sx={{ display: 'flex' }}>
      <ToastContainer />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Employee Dashboard</Typography>
          {/* Profile Info */}
          <Typography variant="body1" color="inherit">
            {user.email
            } ({user.department})
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
          <ListItem button onClick={() => setActiveSection('learnings')}>
            <ListItemIcon><LocalLibrary /></ListItemIcon>
            <ListItemText primary="Learnings" />
          </ListItem>
          <ListItem button onClick={() => setActiveSection('discussion')}>
            <ListItemIcon><FeedbackIcon /></ListItemIcon>
            <ListItemText primary="Discussion" />
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
        {activeSection === 'learnings' && <Learning />}
        {activeSection === 'discussion' && <Discussion />}
        {/* {activeSection === 'feedback' && <Feedback />} */}
      </Box>
    </Box>
  );
}

export default Employee;
