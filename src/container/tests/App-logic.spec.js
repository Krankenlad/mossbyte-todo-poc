// NPM Modules
import React from 'react';

// Units to test
import {
    addNewTodoItem,
    updateNewTodoValue,
    removeDuplicateTodoItems,
} from '../App-logic';

// Generator helpers
import * as genHelpers from '../../generator-helpers';

describe('Given addNewTodItem(store, e) is called', () => {
    describe('When store.newTodoValue is empty and the Enter key is pressed', () => {
        test('Then it will create a new todo list item with an empty value', () => {
            const backupRunGenerator = genHelpers.runGenerator;
            genHelpers.runGenerator = jest.fn();

            const store = {
                someuuid: {
                    isDone: false,
                    itemId: 'someuuid',
                    todoItemValue: 'stuff',
                },
                hintStatus: ' --on',
                newTodoValue: '',
                mossByteId: '00dcbab4-a21c-4744-93f8-9a4abf4e06e0',
                todoItemList: [
                    {
                        guid: 'someuuid',
                        isDone: false,
                        value: 'stuff',
                    },
                ],
            };

            const fakeEvent = {
                key: 'Enter',
            };

            addNewTodoItem(store, fakeEvent);

            expect(store.todoItemList.length).toEqual(2);
            expect(store.todoItemList[1].value).toEqual('');
            expect(store.todoItemList[1].isDone).toEqual(false);
            genHelpers.runGenerator = backupRunGenerator;
        });
    });

    describe('When store.newTodoValue has some text and the Enter key is pressed', () => {
        test('Then it will create a new todo list item with matching text', () => {
            const backupRunGenerator = genHelpers.runGenerator;
            genHelpers.runGenerator = jest.fn();

            const store = {
                someuuid: {
                    isDone: false,
                    itemId: 'someuuid',
                    todoItemValue: 'stuff',
                },
                hintStatus: ' --on',
                newTodoValue: 'new item to be added',
                mossByteId: '00dcbab4-a21c-4744-93f8-9a4abf4e06e0',
                todoItemList: [
                    {
                        guid: 'someuuid',
                        isDone: false,
                        value: 'stuff',
                    },
                ],
            };

            const fakeEvent = {
                key: 'Enter',
            };

            addNewTodoItem(store, fakeEvent);

            expect(store.todoItemList.length).toEqual(2);
            expect(store.todoItemList[1].value).toEqual('new item to be added');
            expect(store.todoItemList[1].isDone).toEqual(false);
            genHelpers.runGenerator = backupRunGenerator;
        });
    });

    describe('When e.key is not "enter"', () => {
        test('Then it will not create any new todo item', () => {
            const backupRunGenerator = genHelpers.runGenerator;
            genHelpers.runGenerator = jest.fn();

            const store = {
                someuuid: {
                    isDone: false,
                    itemId: 'someuuid',
                    todoItemValue: 'stuff',
                },
                hintStatus: ' --on',
                newTodoValue: 'new item to be added',
                mossByteId: '00dcbab4-a21c-4744-93f8-9a4abf4e06e0',
                todoItemList: [
                    {
                        guid: 'someuuid',
                        isDone: false,
                        value: 'stuff',
                    },
                ],
            };

            const fakeEvent = {
                key: 'Shift',
            };

            addNewTodoItem(store, fakeEvent);

            expect(store.todoItemList.length).toEqual(1);
            genHelpers.runGenerator = backupRunGenerator;
        });
    });
});

describe('Given updateNewTodoValue(store, newValue) is called', () => {
    describe('When store.newTodoValue is empty and the newValue === "some text"', () => {
        test('Then it will update the store.newTodoValue to match "some text"', () => {
            const store = {
                someuuid: {
                    isDone: false,
                    itemId: 'someuuid',
                    todoItemValue: 'stuff',
                },
                hintStatus: ' --on',
                newTodoValue: '',
                mossByteId: '00dcbab4-a21c-4744-93f8-9a4abf4e06e0',
                todoItemList: [
                    {
                        guid: 'someuuid',
                        isDone: false,
                        value: 'stuff',
                    },
                ],
            };

            updateNewTodoValue(store, 'some text');

            expect(store.newTodoValue).toEqual('some text');
        });
    });

    describe('When store.newTodoValue is "some text" and the newValue is an empty string', () => {
        test('Then it will update the store.newTodoValue to be an empty string', () => {
            const store = {
                someuuid: {
                    isDone: false,
                    itemId: 'someuuid',
                    todoItemValue: 'stuff',
                },
                hintStatus: ' --on',
                newTodoValue: 'some text',
                mossByteId: '00dcbab4-a21c-4744-93f8-9a4abf4e06e0',
                todoItemList: [
                    {
                        guid: 'someuuid',
                        isDone: false,
                        value: 'stuff',
                    },
                ],
            };

            updateNewTodoValue(store, '');

            expect(store.newTodoValue).toEqual('');
        });
    });
});

describe('Given removeDuplicateTodoItems(todoList) is called', () => {
    describe('When store.newTodoValue is empty and the newValue === "some text"', () => {
        test('Then it will update the store.newTodoValue to match "some text"', () => {
            const todoList = [
                {
                    guid: '9d7c14e4-33b6-0f62-97b9-b971b8827e70',
                    isDone: false,
                    value: 'safssf',
                },
                {
                    guid: '41d52a16-afb0-4cb4-a12d-a26ecbefcb0f',
                    isDone: false,
                    value: 'fasfs',
                },
                {
                    guid: '674f3302-3794-01d1-b7e1-9d0ce84c7ea0',
                    isDone: false,
                    value: '',
                },
                {
                    guid: '9d7c14e4-33b6-0f62-97b9-b971b8827e70',
                    isDone: false,
                    value: 'safssf',
                },
                {
                    value: 'fasfs',
                    isDone: false,
                    guid: '41d52a16-afb0-4cb4-a12d-a26ecbefcb0f',
                },
                {
                    value: '',
                    isDone: false,
                    guid: '674f3302-3794-01d1-b7e1-9d0ce84c7ea0',
                },
                {
                    value: '',
                    isDone: false,
                    guid: '17a38bff-b933-037d-9b4f-8bab6adeed77',
                },
            ];

            const filteredTodoList = [
                {
                    guid: '9d7c14e4-33b6-0f62-97b9-b971b8827e70',
                    isDone: false,
                    value: 'safssf',
                },
                {
                    guid: '41d52a16-afb0-4cb4-a12d-a26ecbefcb0f',
                    isDone: false,
                    value: 'fasfs',
                },
                {
                    guid: '674f3302-3794-01d1-b7e1-9d0ce84c7ea0',
                    isDone: false,
                    value: '',
                },
                {
                    guid: '17a38bff-b933-037d-9b4f-8bab6adeed77',
                    isDone: false,
                    value: '',
                },
            ];

            const result = removeDuplicateTodoItems(todoList);

            expect(result).toEqual(filteredTodoList);
        });
    });

    describe('When store.newTodoValue is "some text" and the newValue is an empty string', () => {
        test('Then it will update the store.newTodoValue to be an empty string', () => {
            const store = {
                someuuid: {
                    isDone: false,
                    itemId: 'someuuid',
                    todoItemValue: 'stuff',
                },
                hintStatus: ' --on',
                newTodoValue: 'some text',
                mossByteId: '00dcbab4-a21c-4744-93f8-9a4abf4e06e0',
                todoItemList: [
                    {
                        guid: 'someuuid',
                        isDone: false,
                        value: 'stuff',
                    },
                ],
            };

            updateNewTodoValue(store, '');

            expect(store.newTodoValue).toEqual('');
        });
    });
});
