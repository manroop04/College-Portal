import * as React from 'react';
import { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (): Promise<void> => {
    if (!username || !password) {
      setError('Required fields cannot be empty');
      return;
    }

    try {
      // In a real app, you would make an API call here
      // For demo purposes, we'll simulate a database check
      const mockUsers = [
        { username: 'admin', password: 'admin123' },
        { username: 'user', password: 'user123' }
      ];

      const userExists = mockUsers.some(
        user => user.username === username && user.password === password
      );

      if (userExists) {
        navigate('/home');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Error connecting to authentication service');
    }
  };

  const handleSignup = (): void => {
    navigate('/signup');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
          Login Form
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              onClick={handleLogin}
              sx={{ flex: 1, mr: 1 }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              onClick={handleSignup}
              sx={{ flex: 1, ml: 1 }}
            >
              Signup
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Dialog for messages (alternative to QMessageBox) */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Login Message</DialogTitle>
        <DialogContent>
          <Typography>{error}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LoginPage; 