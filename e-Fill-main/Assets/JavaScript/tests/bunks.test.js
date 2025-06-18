import { jest } from '@jest/globals';
import { dBase } from '../fireBase/app.js';
import { createLogger } from '../common/utils/logger.js';

const logger = createLogger('bunks-test');

// Mock Firebase Database
jest.mock('../fireBase/app.js', () => ({
    dBase: {
        ref: jest.fn(),
        push: jest.fn(),
        update: jest.fn(),
        remove: jest.fn()
    }
}));

describe('Bunks Management Tests', () => {
    const mockBunk = {
        name: 'Test Station',
        address: '123 Test St',
        city: 'Test City',
        country: 'Test Country',
        email: 'test@station.com',
        number: '1234567890',
        slots: 10,
        freeslots: 5,
        ownerId: 'test-owner-id',
        imageUrl: 'images/test'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Create Bunk', () => {
        test('should successfully create a new bunk', async () => {
            dBase.ref.mockReturnValueOnce({
                push: () => Promise.resolve({ key: 'new-bunk-id' })
            });

            const result = await createBunk(mockBunk);
            expect(result).toBeTruthy();
            expect(dBase.ref).toHaveBeenCalledWith('bunks');
        });

        test('should handle creation error', async () => {
            dBase.ref.mockReturnValueOnce({
                push: () => Promise.reject(new Error('Database error'))
            });

            await expect(createBunk(mockBunk)).rejects.toThrow('Database error');
        });
    });

    describe('Update Bunk', () => {
        test('should successfully update a bunk', async () => {
            const bunkId = 'test-bunk-id';
            dBase.ref.mockReturnValueOnce({
                update: () => Promise.resolve()
            });

            const result = await updateBunk(bunkId, { freeslots: 4 });
            expect(result).toBeTruthy();
            expect(dBase.ref).toHaveBeenCalledWith(`bunks/${bunkId}`);
        });
    });

    describe('Delete Bunk', () => {
        test('should successfully delete a bunk', async () => {
            const bunkId = 'test-bunk-id';
            dBase.ref.mockReturnValueOnce({
                remove: () => Promise.resolve()
            });

            const result = await deleteBunk(bunkId);
            expect(result).toBeTruthy();
            expect(dBase.ref).toHaveBeenCalledWith(`bunks/${bunkId}`);
        });
    });

    describe('Search Bunks', () => {
        test('should find bunks by location', async () => {
            const mockBunks = {
                'bunk-1': { ...mockBunk, city: 'New York' },
                'bunk-2': { ...mockBunk, city: 'Boston' }
            };

            dBase.ref.mockReturnValueOnce({
                once: () => Promise.resolve({
                    val: () => mockBunks
                })
            });

            const results = await searchBunksByLocation('New York');
            expect(results).toHaveLength(1);
            expect(results[0].city).toBe('New York');
        });

        test('should filter bunks by available slots', async () => {
            const mockBunks = {
                'bunk-1': { ...mockBunk, freeslots: 0 },
                'bunk-2': { ...mockBunk, freeslots: 5 }
            };

            dBase.ref.mockReturnValueOnce({
                once: () => Promise.resolve({
                    val: () => mockBunks
                })
            });

            const results = await searchBunksWithFreeSlots();
            expect(results).toHaveLength(1);
            expect(results[0].freeslots).toBe(5);
        });
    });
});
