import { useState, useEffect } from 'react';

const FEEDBACK_STORAGE_KEY = 'learning-lounge-feedback';
const FEEDBACK_DELAY_MS = 30000; // 30 seconds after page load
const FEEDBACK_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours between prompts

interface FeedbackState {
  lastShown: number;
  totalShown: number;
  dismissed: number;
}

export const useFeedbackModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownOnLoad, setHasShownOnLoad] = useState(false);

  useEffect(() => {
    if (hasShownOnLoad) return;

    const timer = setTimeout(() => {
      const shouldShow = checkShouldShowFeedback();
      if (shouldShow) {
        setIsOpen(true);
        updateFeedbackState();
        setHasShownOnLoad(true);
      }
    }, FEEDBACK_DELAY_MS);

    return () => clearTimeout(timer);
  }, [hasShownOnLoad]);

  const checkShouldShowFeedback = (): boolean => {
    try {
      const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      if (!stored) return true;

      const state: FeedbackState = JSON.parse(stored);
      const now = Date.now();
      const timeSinceLastShown = now - state.lastShown;

      // Show if cooldown period has passed
      return timeSinceLastShown >= FEEDBACK_COOLDOWN_MS;
    } catch (error) {
      console.error('Error checking feedback state:', error);
      return true;
    }
  };

  const updateFeedbackState = () => {
    try {
      const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      const state: FeedbackState = stored
        ? JSON.parse(stored)
        : { lastShown: 0, totalShown: 0, dismissed: 0 };

      state.lastShown = Date.now();
      state.totalShown += 1;

      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error updating feedback state:', error);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    try {
      const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      if (stored) {
        const state: FeedbackState = JSON.parse(stored);
        state.dismissed += 1;
        localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(state));
      }
    } catch (error) {
      console.error('Error updating dismissed count:', error);
    }
  };

  const openFeedback = () => {
    setIsOpen(true);
    updateFeedbackState();
  };

  return {
    isOpen,
    openFeedback,
    closeFeedback: handleClose,
  };
};
