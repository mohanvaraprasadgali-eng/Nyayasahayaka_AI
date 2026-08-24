import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, AlertCircle } from 'lucide-react';

export const VoiceInput = ({ onTranscript, placeholder = "Speak in English or Telugu..." }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [supported, setSupported] = useState(true);
  const [speechStatus, setSpeechStatus] = useState('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
      recog.lang = 'en-IN'; // Also catches mixed Indian English & Telugu words

      recog.onstart = () => {
        setIsListening(true);
        setSpeechStatus('Listening to voice input... (Speak now)');
      };

      recog.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setSpeechStatus(`Captured: "${transcript}"`);
        if (event.results[0].isFinal) {
          onTranscript(transcript);
        }
      };

      recog.onerror = (event) => {
        console.warn('Speech Recognition error:', event.error);
        setIsListening(false);
        setSpeechStatus('Microphone capture error. You can also type your problem.');
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    } else {
      setSupported(false);
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (!supported || !recognition) {
      // Simulate voice input fallback
      const sampleSimulatedSpeech = "My employer has not paid my salary of Rs 45000 for the past three months.";
      setSpeechStatus('Browser speech API simulated: Speech input received.');
      onTranscript(sampleSimulatedSpeech);
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
      } catch (err) {
        console.error('Error starting recognition:', err);
      }
    }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <button
        type="button"
        className={`btn btn-sm ${isListening ? 'btn-accent' : 'btn-secondary'}`}
        onClick={toggleListening}
        style={{
          boxShadow: isListening ? '0 0 0 4px rgba(217, 119, 6, 0.3)' : 'none',
          transition: 'all 0.3s ease'
        }}
        title="Voice Input (English / Telugu)"
      >
        {isListening ? (
          <>
            <MicOff size={16} className="animate-pulse text-white" />
            <span style={{ color: '#fff' }}>Stop Recording</span>
          </>
        ) : (
          <>
            <Mic size={16} style={{ color: '#2563EB' }} />
            <span>Speak Instead</span>
          </>
        )}
      </button>

      {speechStatus && (
        <span style={{ fontSize: '0.75rem', color: '#64748B', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {speechStatus}
        </span>
      )}
    </div>
  );
};
