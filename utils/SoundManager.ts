import React, { useEffect } from 'react';
import { Audio } from 'expo-av';

const SOUNDS: Record<string, any> = {
  correct: require('../assets/sounds/correct.mp3'),
  wrong: require('../assets/sounds/wrong.mp3'),
  click: require('../assets/sounds/click.mp3'),
  match: require('../assets/sounds/match.mp3'),
};

export const playSound = async (soundKey: 'correct' | 'wrong' | 'click' | 'match') => {
  try {
    const { sound } = await Audio.Sound.createAsync(SOUNDS[soundKey]);
    await sound.playAsync();
    // Automatically unload sound from memory when done
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.log('Error playing sound:', error);
  }
};
