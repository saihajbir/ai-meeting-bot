# AI Meeting Bot

A React application that provides real-time speech transcription and AI-powered meeting summaries using OpenAI's Whisper and GPT models.

## Features

- 🎙️ Real-time audio recording with visual feedback
- 📝 Live transcription using OpenAI's Whisper model
- 🤖 AI-powered meeting summaries using GPT-3.5
- 📊 Audio visualization
- 🎨 Modern, responsive UI with Material-UI

## Prerequisites

Before you begin, ensure you have:
- Node.js (v14 or higher)
- npm (v6 or higher)
- An OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone [your-repo-url]
cd ai-meeting-bot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenAI API key:
```
REACT_APP_OPENAI_API_KEY=your-api-key-here
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Usage

1. Click the "Start Recording" button to begin recording
2. Speak into your microphone
3. The audio visualizer will show your voice input levels
4. Click "Stop Recording" when finished
5. The app will transcribe your audio and generate an AI summary
6. View both the transcription and summary in their respective sections

## Technologies Used

- React
- TypeScript
- Material-UI
- OpenAI API (Whisper & GPT-3.5)
- Web Audio API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for their amazing API
- Material-UI team for the beautiful components
- The React community for their invaluable resources
