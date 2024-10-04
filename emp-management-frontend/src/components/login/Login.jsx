import React, { useState } from 'react';
import {
  Container,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import { useUser } from '../../UserContext'; 
import { useNavigate } from 'react-router-dom'; 

const defaultTheme = createTheme();

function Login() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false); // State to track if OTP is sent

  const handleForgotPassword = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }), // Send email to the API
      });

      if (response.ok) {
        toast.success('OTP sent to your email!');
        setIsOtpSent(true); // Mark OTP as sent
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error sending OTP. Please check your email.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }), 
      });

      if (response.ok) {
        toast.success('Password updated successfully!');
        setEmail('');
        setOtp('');
        setNewPassword('');
        setIsOtpSent(false); 
        setOpenDialog(false); 
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Invalid OTP or failed to update password.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData = {
      email: data.get('email'),
      password: data.get('password'),
    };

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

    

      if (response.ok) {
        const result = await response.json();
        toast.success('Login successful!');
        localStorage.setItem('token', result.token); // Assuming the response contains a `token` field
        localStorage.setItem('user', JSON.stringify(result.user)); // Save user info as a JSON string

        setUser(result.user);
        
        if (result.user.role === 'admin') {
          navigate('/admin-dashboard'); 
        } else if (result.user.role === 'employee') {
          navigate('/employee-dashboard'); 
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <ToastContainer />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container  sx={{ textAlign: 'center' }}>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={() => setOpenDialog(true)}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
              </Grid>
            </Grid>
          </Box>
        </Box>
        
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle sx={{ textAlign: 'center' }}>Forgot Password</DialogTitle>
          <DialogContent>
            {!isOtpSent ? (
              <TextField
                autoFocus
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <>
                <TextField
                  margin="dense"
                  label="Enter OTP"
                  type="text"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => setOtp(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="New Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            {!isOtpSent ? (
              <Button onClick={handleForgotPassword} color="primary">
                Send OTP
              </Button>
            ) : (
              <Button onClick={handleVerifyOtp} color="primary">
                Verify OTP and Reset Password
              </Button>
            )}
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
