import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useMissionStore } from '../stores/missionStore';

import { getChallengePath } from '../constants/navigation';

interface NavigationParams {
  missionId: string;
  questionIndex: number;
  cityId: string;
  nextType?: string;
  isMissionComplete?: boolean;
  nextMissionId?: string;
}

export const useChallengeNavigation = () => {
  const router = useRouter();
  const missionStore = useMissionStore();

  const navigateToNext = useCallback(({
    missionId,
    cityId,
    isMissionComplete = false,
    nextMissionId
  }: Omit<NavigationParams, 'questionIndex'>) => {
    const queue = missionStore.getQueue(missionId);
    
    // If mission was marked as complete or queue is empty
    if (isMissionComplete || queue.length === 0) {
      router.push({
        pathname: '/defi-resultat',
        params: { 
          cityId, 
          missionId, 
          nextMissionId: nextMissionId || ''
        }
      });
      return;
    }

    // Success! Move to the next item in the queue
    const nextItem = queue[0];
    const nextPath = getChallengePath(nextItem.type);

    router.push({
      pathname: nextPath as any,
      params: { 
        missionId, 
        questionIndex: String(nextItem.index), 
        cityId 
      }
    });
  }, [router, missionStore]);

  const skipQuestion = useCallback(({
    missionId,
    cityId,
  }: { missionId: string, cityId: string }) => {
    missionStore.moveToEnd(missionId);
    navigateToNext({ missionId, cityId });
  }, [missionStore, navigateToNext]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/map');
    }
  }, [router]);

  const restartMission = useCallback(({ 
    missionId, 
    cityId,
    firstQuestionType 
  }: { missionId: string, cityId: string, firstQuestionType: string }) => {
    const nextPath = getChallengePath(firstQuestionType);
    router.replace({
      pathname: nextPath as any,
      params: { 
        missionId, 
        questionIndex: '0', 
        cityId 
      }
    });
  }, [router]);

  return { navigateToNext, skipQuestion, goBack, restartMission };
};
