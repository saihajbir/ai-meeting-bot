import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography, Snackbar, Alert } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import AudioVisualizer from './AudioVisualizer';
import { transcribeAudio, generateSummary } from '../services/transcriptionService';

interface RecordingControlsProps {
  onTranscriptionUpdate: (text: string) => void;
  onRecordingStateChange: (isRecording: boolean) => void;
  onSummaryUpdate?: (summary: string) => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({ 
  onTranscriptionUpdate,
  onRecordingStateChange,
  onSummaryUpdate
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      stopRecording();
    };
  }, []);

  useEffect(() => {
    onRecordingStateChange(isRecording);
  }, [isRecording, onRecordingStateChange]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      audioChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setError(null);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Failed to start recording:', err);
      setError('Failed to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    setIsProcessing(true);
    try {
      // Stop recording
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Process the audio
      if (audioChunksRef.current.length > 0) {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Get transcription
        const transcription = await transcribeAudio(audioBlob);
        if (transcription) {
          onTranscriptionUpdate(transcription);
          
          // Generate summary
          if (onSummaryUpdate) {
            const summary = await generateSummary(transcription);
            onSummaryUpdate(summary);
          }
        }
      }
    } catch (error) {
      console.error('Error processing recording:', error);
      setError(error instanceof Error ? error.message : 'Failed to process recording');
    } finally {
      setIsRecording(false);
      setIsProcessing(false);
      setRecordingTime(0);
      audioChunksRef.current = [];
    }
  };

  const handleRecordingToggle = () => {
    setError(null);
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: 2,
      mb: 4
    }}>
      <Button
        variant="contained"
        onClick={handleRecordingToggle}
        disabled={isProcessing}
        sx={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          backgroundColor: isRecording ? '#4CAF50' : '#1976d2',
          '&:hover': {
            backgroundColor: isRecording ? '#45a049' : '#1565c0',
          },
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          fontSize: '1.2rem',
          textTransform: 'none',
          boxShadow: 3
        }}
      >
        {isRecording ? (
          <>
            <StopIcon sx={{ fontSize: 40 }} />
            Stop Recording
          </>
        ) : (
          'Start Recording'
        )}
      </Button>

      {isRecording && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          padding: '8px 16px',
          borderRadius: 2
        }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#ff0000',
              animation: 'pulse 2s infinite'
            }}
          />
          <Typography>
            Recording... {formatTime(recordingTime)}
          </Typography>
        </Box>
      )}

      {isProcessing && (
        <Typography color="text.secondary">
          Processing your recording...
        </Typography>
      )}

      <AudioVisualizer isRecording={isRecording} />

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RecordingControls; 