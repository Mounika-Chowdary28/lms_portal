import {jwtDecode} from 'jwt-decode';

type DecodedToken = {
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  exp: number;
};

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Invalid token');
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true; // Assume expired if decode fails
  }
};
