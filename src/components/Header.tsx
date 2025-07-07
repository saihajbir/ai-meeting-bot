import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MicIcon from '@mui/icons-material/Mic';

const Header: React.FC = () => {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MicIcon sx={{ fontSize: 32, mr: 2 }} />
          <Typography variant="h6" component="div">
            AI Meeting Bot
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton color="inherit" aria-label="settings">
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 