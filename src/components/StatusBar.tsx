import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

interface StatusBarProps {
  duration?: string;
  status?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({
  duration = '00:00:00',
  status = 'Ready'
}) => {
  return (
    <Paper 
      elevation={1}
      sx={{
        p: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: 'background.paper'
      }}
    >
      <Typography variant="body2" sx={{ fontFamily: 'Source Code Pro, monospace' }}>
        Recording: {duration}
      </Typography>
      <Box sx={{ width: 1, mx: 2, borderTop: '1px solid', borderColor: 'divider' }} />
      <Typography variant="body2">
        Status: {status}
      </Typography>
    </Paper>
  );
};

export default StatusBar; 