import React from 'react';
import { render } from '@testing-library/react-native';
import { MainBottomNav } from '../components/MainBottomNav';
import { usePathname } from 'expo-router';

describe('MainBottomNav', () => {
  it('renders correctly', () => {
    (usePathname as jest.Mock).mockReturnValue('/map');
    const { getByText } = render(<MainBottomNav />);
    
    // Check for some labels
    expect(getByText('Ligue')).toBeTruthy();
    expect(getByText('CARTE')).toBeTruthy(); // Uppercase when active
    expect(getByText('Profil')).toBeTruthy();
    expect(getByText('Réglages')).toBeTruthy();
  });

  it('highlights the active route', () => {
    (usePathname as jest.Mock).mockReturnValue('/leaderboard');
    const { getByText } = render(<MainBottomNav />);
    expect(getByText('LIGUE')).toBeTruthy(); // Uppercase when active
    expect(getByText('Carte')).toBeTruthy();
  });
});
