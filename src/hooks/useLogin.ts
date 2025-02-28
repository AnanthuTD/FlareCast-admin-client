import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/AuthService';

interface LoginParams {
  email: string;
  password: string;
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async ({ email, password }: LoginParams): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Call your authentication service to login
      await authService.login({ email, password });

      // On successful login, navigate to the desired page
      router.push('/admin/dashboard'); // or any page where you want to redirect after login
    } catch (err) {
      // Handle errors appropriately
      setError((err as Error).message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
  };
};
