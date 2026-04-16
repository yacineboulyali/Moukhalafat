import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('./hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#007AFF',
      background: '#FFFFFF',
      surface: '#FFFFFF',
      border: '#E5E5E5',
      onSurfaceVariant: '#666666',
    },
    isDark: false,
  }),
}));
