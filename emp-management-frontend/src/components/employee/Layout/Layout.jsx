// Layout.js
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
import { LocalLibrary, Feedback as FeedbackIcon } from '@mui/icons-material';
import { ToastContainer } from 'react-toastify';
import Learning from '../Learning';
import Feedback from '../Feedback';
import Discussion from '../Discussion';

const drawerWidth = 240;

function Layout({ children }) {
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('activeSection') || 'learnings';
  });

  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

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
            <ListItemIcon><LocalLibrary /></ListItemIcon>
            <ListItemText primary="Learnings" />
          </ListItem>
          <ListItem button onClick={() => setActiveSection('feedback')}>
            <ListItemIcon><FeedbackIcon /></ListItemIcon>
            <ListItemText primary="Feedback" />
          </ListItem>
          <ListItem button onClick={() => setActiveSection('discussion')}>
            <ListItemIcon><LocalLibrary /></ListItemIcon>
            <ListItemText primary="Discussion" />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 4, marginTop: '64px' }}>
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
