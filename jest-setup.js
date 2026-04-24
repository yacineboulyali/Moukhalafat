import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('expo-blur', () => ({
  BlurView: ({ children, style }: any) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, { style, testID: 'BlurView' }, children);
  },
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  usePathname: jest.fn(() => '/'),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('./hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#007AFF',
      gold: '#D4AF37',
      background: '#FFFFFF',
      surface: '#FFFFFF',
      onSurface: '#000000',
      border: '#E5E5E5',
      onSurfaceVariant: '#666666',
    },
    isDark: false,
  }),
}));

jest.mock('./services/sounds', () => ({
  SoundService: {
    getInstance: () => ({
      playSound: jest.fn(),
      triggerHaptic: jest.fn(),
    }),
  },
}));
