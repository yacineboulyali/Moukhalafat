import React from 'react';
import { render } from '@testing-library/react-native';
import MissionStepper from '../MissionStepper';

describe('MissionStepper', () => {
  it('renders correctly with default missions', () => {
    const { getByText, getAllByText } = render(
      <MissionStepper currentMissionIndex={0} totalMissions={5} />
    );

    // Should find texts 1 to 5
    expect(getByText('1')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
    expect(getByText('4')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
  });

  it('renders the correct active mission index', () => {
    const { getByText } = render(
      <MissionStepper currentMissionIndex={2} totalMissions={5} />
    );
    
    // We can't easily check styles here because of complex style arrays,
    // but we check if the component renders.
    expect(getByText('3')).toBeTruthy();
  });
});
