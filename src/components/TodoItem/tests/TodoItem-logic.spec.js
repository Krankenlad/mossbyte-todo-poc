// Units to be tested
import {
    updateTodoItemValue,
    updateDoneStatus,
    removeTodoItem,
} from '../TodoItem-logic';

// Generator helpers
import * as genHelpers from '../../../generator-helpers';

// Initial State for tests that need it
import { initialState } from '../TodoItem';

describe('Given updateTodoItemValue(store, newValue) is called', () => {
    describe('When newValue is an empty string', () => {
        test('Then it will update the store.todoItemValue be an empty string', () => {
            const store = initialState;
            store.todoItemValue = 'something';

            updateTodoItemValue(store, '');

            expect(store.todoItemValue).toEqual('');
        });
    });

    describe('When newValue is an identical to the existing value', () => {
        test('Then it store.todoItemValue will be the same', () => {
            const store = initialState;
            store.todoItemValue = 'something';

            updateTodoItemValue(store, 'something');

            expect(store.todoItemValue).toEqual('something');
        });
    });
});

describe('Given updateDoneStatus(store, newStatus) is called', () => {
    describe('When store.isDone was true and the newStatus is "true"', () => {
        test('Then it will update the store.isDone status to be false', () => {
            const backupRunGenerator = genHelpers.runGenerator;
            genHelpers.runGenerator = jest.fn();

            const store = initialState;
            store.isDone = true;

            updateDoneStatus(store, 'true');

            expect(store.isDone).toEqual(false);
            genHelpers.runGenerator = backupRunGenerator;
        });
    });

    describe('When store.isDone was false and the newStatus is "false"', () => {
        test('Then it will update the store.isDone status to be true', () => {
            const backupRunGenerator = genHelpers.runGenerator;
            genHelpers.runGenerator = jest.fn();

            const store = initialState;
            store.isDone = false;

            updateDoneStatus(store, 'false');

            expect(store.isDone).toEqual(true);
            genHelpers.runGenerator = backupRunGenerator;
        });
    });
});

describe('Given removeTodoItem(appStore, itemId) is called', () => {
    describe('When itemId matches a todo item in the appStore', () => {
        test('Then it will remove that item from the appStore', () => {
            const backupRunGenerator = genHelpers.runGenerator;
            genHelpers.runGenerator = jest.fn();

            const store = {
                someuuid: {
                    isDone: false,
                    itemId: 'someuuid',
                    todoItemValue: 'stuff',
                },
                hintStatus: ' --on',
                mossByteId: '00dcbab4-a21c-4744-93f8-9a4abf4e06e0',
                todoItemList: [
                    {
                        guid: 'someuuid',
                        isDone: false,
                        value: 'stuff',
                    },
                ],
            };

            const finalStore = {
                hintStatus: ' --on',
                mossByteId: '00dcbab4-a21c-4744-93f8-9a4abf4e06e0',
                todoItemList: [],
            };

            removeTodoItem(store, 'someuuid');

            expect(store).toEqual(finalStore);
            genHelpers.runGenerator = backupRunGenerator;
        });
    });

    describe('When itemId has no match', () => {
        test('Then it will not remove any items from the store', () => {
            const backupRunGenerator = genHelpers.runGenerator;
            genHelpers.runGenerator = jest.fn();

            const store = {
                someuuid: {
                    isDone: false,
                    itemId: 'someuuid',
                    todoItemValue: 'stuff',
                },
                hintStatus: ' --on',
                mossByteId: '00dcbab4-a21c-4744-93f8-9a4abf4e06e0',
                todoItemList: [
                    {
                        guid: 'someuuid',
                        isDone: false,
                        value: 'stuff',
                    },
                ],
            };

            removeTodoItem(store, 'nonexistent');

            expect(store).toEqual(store);
            genHelpers.runGenerator = backupRunGenerator;
        });
    });
});
