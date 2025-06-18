// Jest setup file for e-Fill tests

// Mock browser environment
const mockLocalStorage = {
    store: {},
    getItem(key) {
        return this.store[key] || null;
    },
    setItem(key, value) {
        this.store[key] = value.toString();
    },
    clear() {
        this.store = {};
    }
};

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
});

// Mock Firebase Authentication
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => ({
        currentUser: null,
        onAuthStateChanged: jest.fn()
    })),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn()
}));

// Mock Firebase Realtime Database
jest.mock('firebase/database', () => ({
    getDatabase: jest.fn(),
    ref: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    child: jest.fn()
}));

// Reset mocks between tests
beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
});
