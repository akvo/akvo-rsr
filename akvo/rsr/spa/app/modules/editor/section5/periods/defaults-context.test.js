/* global jest, describe, it, test */
import expect from 'expect';
import { defaultPeriodsReducer } from './defaults-context';

describe('defaultPeriodsReducer', () => {
    describe('INIT action', () => {
        it('should set the state.items with action.items', () => {
            const init = { items: [], added: [], removed: [], status: null };
            const items = [{ startDate: '01/01/2020', endDate: '31/01/2020' }];
            const state = defaultPeriodsReducer(init, { type: 'INIT', items });
            expect(state).toEqual({ ...init, items: [...items] });
        });
        test('should reset state.added and state.removed', () => {
            const init = {
                items: [
                    { startDate: '01/01/2020', endDate: '31/01/2020' },
                    { startDate: '01/02/2020', endDate: '29/02/2020' },
                ],
                added: [{ startDate: '01/03/2020', endDate: '31/03/2020' }],
                removed: [{ startDate: '01/04/2020', endDate: '30/04/2020' }],
            };
            const items = [{ startDate: '01/01/2020', endDate: '31/01/2020' }];
            const state = defaultPeriodsReducer(init, { type: 'INIT', items });
            expect(state).toEqual({ items: [...items], added: [], removed: [], status: null });
        });
    });
    describe('RESET_ADDED', () => {
        it('should reset the state.added', () => {
            const init = {
                items: [
                    { startDate: '01/01/2020', endDate: '31/01/2020' },
                    { startDate: '01/02/2020', endDate: '29/02/2020' },
                ],
                added: [{ startDate: '01/03/2020', endDate: '31/03/2020' }],
                removed: [{ startDate: '01/04/2020', endDate: '30/04/2020' }],
                status: null
            };
            const state = defaultPeriodsReducer(init, { type: 'RESET_ADDED', payload: 'added' });
            expect(state).toEqual({ ...init, added: [], status: 'added' });
        });
    });
    describe('RESET_REMOVED', () => {
        it('should reset state.removed', () => {
            const init = {
                items: [
                    { startDate: '01/01/2020', endDate: '31/01/2020' },
                    { startDate: '01/02/2020', endDate: '29/02/2020' },
                ],
                added: [{ startDate: '01/03/2020', endDate: '31/03/2020' }],
                removed: [{ startDate: '01/04/2020', endDate: '30/04/2020' }],
                status: null
            };
            const state = defaultPeriodsReducer(init, { type: 'RESET_REMOVED', payload: 'removed' });
            expect(state).toEqual({ ...init, removed: [], status: 'removed' });
        });
    });
    describe('MODIFY', () => {
        it('should set state.added when adding new default period', () => {
            const init = {
                items: [
                    { startDate: '01/01/2020', endDate: '31/01/2020' },
                    { startDate: '01/02/2020', endDate: '29/02/2020' },
                ],
                added: [{ startDate: '01/02/2020', endDate: '29/02/2020' }],
                removed: [],
                status: null
            };
            const items = [
                { startDate: '01/01/2020', endDate: '31/01/2020' },
                { startDate: '01/02/2020', endDate: '29/02/2020' },
                { startDate: '01/03/2020', endDate: '31/03/2020' },
            ];
            const state = defaultPeriodsReducer(init, { type: 'MODIFY', items });
            expect(state.items).toEqual(items);
            expect(state.added).toEqual([
                { startDate: '01/02/2020', endDate: '29/02/2020' },
                { startDate: '01/03/2020', endDate: '31/03/2020' },
            ]);
        });
        it('should set state.removed when removing a default period', () => {
            const init = {
                items: [
                    { startDate: '01/01/2020', endDate: '31/01/2020' },
                    { startDate: '01/02/2020', endDate: '29/02/2020' },
                    { startDate: '01/03/2020', endDate: '31/03/2020' },
                ],
                added: [],
                removed: [{ startDate: '01/04/2020', endDate: '30/04/2020' }],
                status: null
            };
            const items = [
                { startDate: '01/01/2020', endDate: '31/01/2020' },
                { startDate: '01/02/2020', endDate: '29/02/2020' },
            ];
            const state = defaultPeriodsReducer(init, { type: 'MODIFY', items });
            expect(state.items).toEqual(items);
            expect(state.removed).toEqual([
                { startDate: '01/04/2020', endDate: '30/04/2020' },
                { startDate: '01/03/2020', endDate: '31/03/2020' },
            ]);
        });
        test('added but than removed', () => {
            const init = {
                items: [
                    { startDate: '01/01/2020', endDate: '31/01/2020' },
                    { startDate: '01/02/2020', endDate: '29/02/2020' },
                ],
                added: [{ startDate: '01/02/2020', endDate: '29/02/2020' }],
                removed: [{ startDate: '01/03/2020', endDate: '15/03/2020' }],
                status: null
            };
            const items1 = [
                { startDate: '01/01/2020', endDate: '31/01/2020' },
                { startDate: '01/02/2020', endDate: '29/02/2020' },
                { startDate: '01/03/2020', endDate: '31/03/2020' },
            ];
            const state1 = defaultPeriodsReducer(init, { type: 'MODIFY', items: items1 });
            const items2 = [
                { startDate: '01/01/2020', endDate: '31/01/2020' },
                { startDate: '01/02/2020', endDate: '29/02/2020' },
            ];
            const state2 = defaultPeriodsReducer(state1, { type: 'MODIFY', items: items2 });
            expect(state2.items).toEqual(items2);
            expect(state2.added).toEqual([{ startDate: '01/02/2020', endDate: '29/02/2020' }]);
            expect(state2.removed).toEqual([{ startDate: '01/03/2020', endDate: '15/03/2020' }]);
        });
        test('removed but then re-added', () => {
            const init = {
                items: [
                    { startDate: '01/01/2020', endDate: '31/01/2020' },
                    { startDate: '01/02/2020', endDate: '29/02/2020' },
                    { startDate: '01/03/2020', endDate: '31/03/2020' },
                ],
                added: [{ startDate: '01/02/2020', endDate: '29/02/2020' }],
                removed: [{ startDate: '01/03/2020', endDate: '15/03/2020' }],
                status: null
            };
            const items1 = [
                { startDate: '01/01/2020', endDate: '31/01/2020' },
                { startDate: '01/02/2020', endDate: '29/02/2020' },
            ];
            const state1 = defaultPeriodsReducer(init, { type: 'MODIFY', items: items1 });
            const items2 = [
                { startDate: '01/01/2020', endDate: '31/01/2020' },
                { startDate: '01/02/2020', endDate: '29/02/2020' },
                { startDate: '01/03/2020', endDate: '31/03/2020' },
            ];
            const state2 = defaultPeriodsReducer(state1, { type: 'MODIFY', items: items2 });
            expect(state2.items).toEqual(items2);
            expect(state2.added).toEqual([{ startDate: '01/02/2020', endDate: '29/02/2020' }]);
            expect(state2.removed).toEqual([{ startDate: '01/03/2020', endDate: '15/03/2020' }]);
        });
    });
});
