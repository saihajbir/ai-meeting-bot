import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

interface TranscriptionAreaProps {
  transcription?: string;
}

const TranscriptionArea: React.FC<TranscriptionAreaProps> = ({ transcription = '' }) => {
  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: 3,
        minHeight: 300,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Transcription
      </Typography>
      <Box 
        sx={{ 
          flex: 1,
          bgcolor: 'background.default',
          p: 2,
          borderRadius: 1,
          overflowY: 'auto'
        }}
      >
        {transcription ? (
          <Typography variant="body1">
            {transcription}
          </Typography>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Start recording to see transcription...
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default TranscriptionArea; 