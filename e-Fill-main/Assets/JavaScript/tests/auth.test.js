import { jest } from '@jest/globals';
import { auth } from '../fireBase/app.js';
import { loginUser, registerUser } from '../fireBase/users.js';

// Mock Firebase auth
jest.mock('../fireBase/app.js', () => ({
    auth: {
        createUserWithEmailAndPassword: jest.fn(),
        signInWithEmailAndPassword: jest.fn(),
    }
}));

describe('Authentication Tests', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('Registration', () => {
        test('should successfully register a new user', async () => {
            const mockUser = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
                isAdmin: false
            };

            const mockCreds = {
                user: { uid: 'test-uid' }
            };

            auth.createUserWithEmailAndPassword.mockResolvedValueOnce(mockCreds);

            await registerUser(mockUser, '/dashboard', {});
            
            expect(auth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
                mockUser.email,
                mockUser.password
            );
        });

        test('should handle registration error', async () => {
            const mockUser = {
                email: 'existing@example.com',
                password: 'password123'
            };

            auth.createUserWithEmailAndPassword.mockRejectedValueOnce({
                code: 'auth/email-already-in-use'
            });

            await registerUser(mockUser, '/dashboard', {});
            
            expect(auth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
                mockUser.email,
                mockUser.password
            );
        });
    });

    describe('Login', () => {
        test('should successfully login user', async () => {
            const mockUser = {
                email: 'test@example.com',
                password: 'password123'
            };

            auth.signInWithEmailAndPassword.mockResolvedValueOnce({
                user: { uid: 'test-uid' }
            });

            await loginUser(mockUser, '/dashboard', {});
            
            expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith(
                mockUser.email,
                mockUser.password
            );
        });

        test('should handle login error', async () => {
            const mockUser = {
                email: 'wrong@example.com',
                password: 'wrongpass'
            };

            auth.signInWithEmailAndPassword.mockRejectedValueOnce({
                code: 'auth/wrong-password'
            });

            await loginUser(mockUser, '/dashboard', {});
            
            expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith(
                mockUser.email,
                mockUser.password
            );
        });
    });
});
