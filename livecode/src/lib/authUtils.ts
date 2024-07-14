import { callApi } from './api';
import { useSetRecoilState } from 'recoil';
import { AuthResult,RegistrationData,LoginData,AuthResponse,User } from './interfaces';
import { userState,tokenState } from '@/state/authState';
const handleAuthErrors = (error: string, status: number): AuthResult['errors'] => {
  
  const errors: AuthResult['errors'] = {};
  const errorMessage = error.toLowerCase();

  if (status === 400 || status === 401) {
    if (errorMessage.includes('username')) {
      errors.username = 'Username is already taken.';
    }
    if (errorMessage.includes('email')) {
      errors.email = 'Email is already registered or invalid.';
    }
    if (errorMessage.includes('password')) {
      errors.password = 'Password does not meet requirements or is incorrect.';
    }
    if (Object.keys(errors).length === 0) {
      errors.general = 'Invalid credentials.';
    }
  } else {
    errors.general = error;
  }

  return errors;
};

const authenticateUser = async (
  endpoint: string,
  data: RegistrationData | LoginData
): Promise<AuthResult> => {
  try {
    const response = await callApi<AuthResponse>('POST', endpoint, data);

    if (response.error) {
      return { success: false, errors: handleAuthErrors(response.error, response.status) };
    }

    if (response.data) {
      localStorage.setItem('refresh_token',response.data?.refresh_token);
      return { success: true, user: response.data.user, access_token: response.data.access_token };
    }

    return { success: false, errors: { general: 'An unexpected error occurred.' } };
  } catch (error) {
    console.error(`Authentication error (${endpoint}):`, error);
    return { success: false, errors: { general: 'An unexpected error occurred.' } };
  }
};

export const useAuthActions = () => {
  const setUser = useSetRecoilState(userState);
  const setToken = useSetRecoilState(tokenState);

  const updateAuthState = (user: User | null, access_token: string | null) => {
    setUser(user);
    setToken(access_token);
  };

  const registerUser = async (data: RegistrationData): Promise<AuthResult> => {
    const result = await authenticateUser('users/signup', data);
    if (result.success) {
      updateAuthState(result.user!, result.access_token!);
    }
    return result;
  };

  const loginUser = async (data: LoginData): Promise<AuthResult> => {
    const result = await authenticateUser('users/login', data);
    console.log(result)
    if (result.success) {
      console.log(result.user)
      updateAuthState(result.user!, result.access_token!);
      console.log(result.access_token)
    }
    return result;
  };

  const logoutUser = () => {
    updateAuthState(null, null);
  };

  return { registerUser, loginUser, logoutUser };
};