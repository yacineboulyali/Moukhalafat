import React from 'react';
import { render } from '@testing-library/react-native';
import { Platform, View } from 'react-native';
import { SafeBlurView } from '../components/SafeBlurView';

// Helper to mock platform
const mockPlatform = (os: 'ios' | 'android' | 'web') => {
  Object.defineProperty(Platform, 'OS', {
    get: () => os,
    configurable: true
  });
};

describe('SafeBlurView', () => {
  const originalPlatform = Platform.OS;

  afterEach(() => {
    mockPlatform(originalPlatform as any);
  });

  it('renders a BlurView on iOS', () => {
    mockPlatform('ios');
    const { getByTestId } = render(
      <SafeBlurView intensity={50} testID="SafeView">
        <View />
      </SafeBlurView>
    );
    // On iOS, SafeBlurView returns BlurView (mocked in jest-setup)
    expect(getByTestId('BlurView')).toBeTruthy();
  });

  it('renders a View with fallback color on Android', () => {
    mockPlatform('android');
    const { queryByTestId, getByTestId } = render(
      <SafeBlurView intensity={50} tint="dark" testID="SafeView">
        <View />
      </SafeBlurView>
    );
    // On Android, it should NOT render the BlurView mock
    expect(queryByTestId('BlurView')).toBeNull();
    
    // It should render a normal View with the testID
    const view = getByTestId('SafeView');
    expect(view.props.style).toContainEqual(expect.objectContaining({
      backgroundColor: 'rgba(0,0,0,0.8)'
    }));
  });

  it('renders a custom fallback color on Android', () => {
    mockPlatform('android');
    const { getByTestId } = render(
      <SafeBlurView intensity={50} fallbackColor="red" testID="SafeView">
        <View />
      </SafeBlurView>
    );
    const view = getByTestId('SafeView');
    expect(view.props.style).toContainEqual(expect.objectContaining({
      backgroundColor: 'red'
    }));
  });
});
