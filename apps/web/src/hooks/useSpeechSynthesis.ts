import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechSynthesisOptions {
  rate?: number;
  pitch?: number;
  preferredLang?: string;
  onEnd?: () => void;
  onStart?: () => void;
  onError?: (error: string) => void;
}

interface UseSpeechSynthesisReturn {
  speak: (text: string) => void;
  cancel: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
}

/**
 * Custom hook for Text-to-Speech using Web Speech API
 * Defaults to British English (en-GB) voice with professional examiner tone
 */
export function useSpeechSynthesis(options: UseSpeechSynthesisOptions = {}): UseSpeechSynthesisReturn {
  const {
    rate = 0.9, // Slightly slower for professional examiner tone
    pitch = 1,
    preferredLang = 'en-GB',
    onEnd,
    onStart,
    onError,
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check if Web Speech API is supported
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load available voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Find the best British English voice
      // Priority: en-GB > en-AU > en (any) > first available
      let voice: SpeechSynthesisVoice | null = null;

      // Try to find en-GB voice first
      voice = availableVoices.find(
        v => v.lang === 'en-GB' || v.lang.startsWith('en-GB')
      ) || null;

      // Fallback to Australian English (also sounds professional)
      if (!voice) {
        voice = availableVoices.find(
          v => v.lang === 'en-AU' || v.lang.startsWith('en-AU')
        ) || null;
      }

      // Fallback to any English voice
      if (!voice) {
        voice = availableVoices.find(
          v => v.lang.startsWith('en')
        ) || null;
      }

      // Last resort: use the first available voice
      if (!voice && availableVoices.length > 0) {
        voice = availableVoices[0];
      }

      setSelectedVoice(voice);
    };

    // Load voices immediately if available
    loadVoices();

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [isSupported, preferredLang]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  const cancel = useCallback(() => {
    if (!isSupported) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    utteranceRef.current = null;
  }, [isSupported]);

  const speak = useCallback((text: string) => {
    if (!isSupported) {
      onError?.('Speech synthesis is not supported in this browser');
      return;
    }

    if (!text.trim()) {
      return;
    }

    // Cancel any ongoing speech
    cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Set voice if available
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Set speech parameters
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1;

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      onStart?.();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
      onEnd?.();
    };

    utterance.onerror = (event) => {
      setIsSpeaking(false);
      utteranceRef.current = null;
      // Don't report 'interrupted' errors as these are from cancel()
      if (event.error !== 'interrupted') {
        onError?.(event.error);
      }
    };

    // Chrome sometimes requires a small delay
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 50);
  }, [isSupported, selectedVoice, rate, pitch, cancel, onStart, onEnd, onError]);

  return {
    speak,
    cancel,
    isSpeaking,
    isSupported,
    voices,
    selectedVoice,
  };
}

/**
 * Utility function to speak a question (for use outside of React components)
 */
export function speakQuestion(text: string, options: UseSpeechSynthesisOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis is not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find en-GB voice
    const voices = window.speechSynthesis.getVoices();
    const britishVoice = voices.find(v => v.lang === 'en-GB' || v.lang.startsWith('en-GB'));
    if (britishVoice) {
      utterance.voice = britishVoice;
    }

    utterance.rate = options.rate ?? 0.9;
    utterance.pitch = options.pitch ?? 1;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(new Error(e.error));

    window.speechSynthesis.speak(utterance);
  });
}
