import { useAuth } from '@clerk/clerk-expo';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/');
    }
  }, [isSignedIn, isLoaded]);

  if (!isLoaded) {
    return null; // or a loading screen
  }

  return <Stack />;
}
