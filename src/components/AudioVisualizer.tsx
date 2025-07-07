import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

interface AudioVisualizerProps {
  isRecording: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isRecording }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let animationFrameId: number;

    const initializeAudio = async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }

        if (isRecording && !mediaStreamRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;

          const source = audioContextRef.current.createMediaStreamSource(stream);
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;
          source.connect(analyserRef.current);
        }
      } catch (err) {
        console.error('Error accessing microphone:', err);
        setError('Could not access microphone');
      }
    };

    const drawVisualizer = () => {
      const canvas = canvasRef.current;
      const analyser = analyserRef.current;
      
      if (!canvas || !analyser) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const barWidth = canvas.width / bufferLength;

      const draw = () => {
        if (!isRecording) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          return;
        }

        animationFrameId = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        dataArray.forEach((value, i) => {
          const height = (value / 255) * canvas.height * 0.8;
          const x = i * (barWidth + 1);
          const y = (canvas.height - height) / 2;
          
          ctx.fillStyle = '#2196F3';
          ctx.fillRect(x, y, barWidth, height);
        });
      };

      draw();
    };

    if (isRecording) {
      initializeAudio().then(drawVisualizer);
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording]);

  return (
    <Box sx={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <canvas
          ref={canvasRef}
          width={300}
          height={100}
          style={{
            width: '100%',
            maxWidth: 300,
            height: 100,
          }}
        />
      )}
    </Box>
  );
};

export default AudioVisualizer; 