import React, { useState } from 'react';
import { Container, Box, Typography, Paper, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import './App.css';
import Header from './components/Header';
import RecordingControls from './components/RecordingControls';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState('');

  const handleTranscriptionUpdate = (text: string | ((prevText: string) => string)) => {
    if (typeof text === 'function') {
      setTranscription(text);
    } else {
      setTranscription(text);
    }
  };

  const handleSummaryUpdate = (text: string) => {
    console.log('Received summary update:', text);
    setSummary(text);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Header />
        <Container maxWidth="md">
          <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <RecordingControls 
              onTranscriptionUpdate={handleTranscriptionUpdate}
              onRecordingStateChange={setIsRecording}
              onSummaryUpdate={handleSummaryUpdate}
            />
            
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: isRecording ? '#4CAF50' : 'text.primary' }}>
                Live Transcription {isRecording && '(Recording...)'}
              </Typography>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2, 
                  minHeight: '150px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  bgcolor: 'white',
                  border: isRecording ? '2px solid #4CAF50' : 'none'
                }}
              >
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                  {transcription || 'Start recording to see your transcription here...'}
                </Typography>
              </Paper>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                AI Summary
              </Typography>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2, 
                  minHeight: '100px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  bgcolor: 'white',
                  border: summary ? '2px solid #2196F3' : '1px solid #e0e0e0'
                }}
              >
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                  {summary || 'Stop recording to generate an AI summary of your transcript...'}
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
