import { useAuthContext } from 'src/auth/hooks';

// gateway user carries one role per service; DEVELOPER inherits ADMIN like the rest of the admin
export const useCscRole = () => {
  const { user } = useAuthContext();
  const role: string = user?.roles?.CSC ?? '';

  return { role, isAdmin: role === 'ADMIN' || role === 'DEVELOPER' };
};
