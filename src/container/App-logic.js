// NPM Modules
import React from 'react';
import { observable, toJS } from 'mobx';

// Generator helpers
import * as genHelpers from '../generator-helpers';

// API Functions to interact with the database
import * as apis from './App-apis';

// Constants
import * as constants from '../Global-constants';

/**
 * Generates RFC4122 compliant Globally Unique Id's
 * Code sourced from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 * Cleaned up code to help with readability
 */
export const generateGUID = () => {
    // Generate the lookup table
    const lookUpTable = [];
    for (let i = 0; i < 256; i += 1) {
        lookUpTable[i] = ((i < 16) ? '0' : '') + (i).toString(16);
    }

    // Configure the seeds for generating the GUID
    const seed0 = Math.random() * 0xffffffff | 0;
    const seed1 = Math.random() * 0xffffffff | 0;
    const seed2 = Math.random() * 0xffffffff | 0;
    const seed3 = Math.random() * 0xffffffff | 0;

    /* eslint-disable prefer-template */

    // Perform bitwise operations to shift the pointer along the seeds whilst appending uniquely generated characters to the returned GUID
    return (
        lookUpTable[seed0 & 0xff] +
        lookUpTable[(seed0 >> 8) & 0xff] +
        lookUpTable[(seed0 >> 16) & 0xff] +
        lookUpTable[(seed0 >> 24) & 0xff] +
        '-' +
        lookUpTable[seed1 & 0xff] +
        lookUpTable[(seed1 >> 8) & 0xff] +
        '-' +
        lookUpTable[(seed1 >> 16) & (0x0f | 0x40)] +
        lookUpTable[(seed1 >> 24) & 0xff] +
        '-' +
        lookUpTable[(seed2 & 0x3f) | 0x80] +
        lookUpTable[(seed2 >> 8) & 0xff] +
        '-' +
        lookUpTable[(seed2 >> 16) & 0xff] +
        lookUpTable[(seed2 >> 24) & 0xff] +
        lookUpTable[seed3 & 0xff] +
        lookUpTable[(seed3 >> 8) & 0xff] +
        lookUpTable[(seed3 >> 16) & 0xff] +
        lookUpTable[(seed3 >> 24) & 0xff]
    );

    /* eslint-enable prefer-template */
};

/**
 * Takes a list of details for todo items and returns an array of React components
 * that display this information.
 * @param {object} store - MobX store
 * @param {array} initialState - Initial state of a default todo item's store
 * @param {element} TodoItem - React template for displaying a todo item
 * @return {array} - Array of React components
 */
export const generateTodoItems = (store, initialState, TodoItem) => {
    return store.todoItemList.map((item) => {
        if (item.guid) {
            store[item.guid] = observable(initialState);

            return (
                <TodoItem
                    key={item.guid}
                    value={item.value}
                    isDone={item.isDone}
                    state={item.state}
                    itemId={item.guid}
                />
            );
        }

        // Item has no guid so we don't want to try render it out
        return undefined;
    });
};

export const updateAppHintStatus = (store, newTodoValue) => {
    const isEmptyWithNoHints = (newTodoValue === '' && store.hintStatus === '');
    const hasValueWithHints = (newTodoValue !== '' && store.hintStatus === ' --on');

    if (isEmptyWithNoHints) {
        store.hintStatus = ' --on';
    } else if (hasValueWithHints) {
        store.hintStatus = '';
    }
};

export function* getMossByteDbId() {
    try {
        let mossByteId = '';
        mossByteId = yield apis.checkMossByteForExistingDb(constants.baseUrl, constants.publicKey);

        if (mossByteId === '') {
            mossByteId = yield apis.createMossDb(constants.baseUrl, constants.publicKey, constants.privateKey);
        }
    } catch (error) {
        throw (error);
    }
}

export function* getRemoteTodoItemList() {
    try {
        yield apis.getMossByteTodoItemList(constants.baseUrl, constants.publicKey);
    } catch (error) {
        throw (error);
    }
}

/**
 * Takes a list of objects with guid properties and returns an array with the first instance of any duplicates
 * @param {array} todoList - Full list including possible duplicate items
 * @return {array} - Filtered list of items with unique guid properties
 */
export const removeDuplicateTodoItems = (todoList) => {
    return todoList.filter((todoItem, index, mossByteTodoArray) => {
        const isUniqueItem = !mossByteTodoArray.slice(index + 1).some((remainder) => {
            return (remainder.guid === todoItem.guid);
        });

        return (isUniqueItem && todoItem);
    });
};

/**
 * Combines todo list items back into a data structure compatible with the local MobX Store
 * @param {object} remotePayload - The full payload response from a GET request to the MossByte DB
 * @return {array} - Combined list of todo items
 */
export const packRemoteTodoItemsIntoList = (remotePayload) => {
    let packagedTodoList = [];

    if (genHelpers.isRealObject(remotePayload.object)) {
        const itemIdList = Object.keys(remotePayload.object);

        packagedTodoList = itemIdList.map((todoItemKey) => {
            const todoItem = remotePayload.object[todoItemKey];
            return {
                guid: todoItem.guid,
                isDone: todoItem.isDone,
                state: todoItem.state,
                value: todoItem.value.trim(),
            };
        });
    }

    return packagedTodoList;
};

/**
 * Checks if there are existing todo items in the remote MossByte DB and merges them into the client's store
 * @param {object} store - MobX store
 */
export const updateClientTodoItemList = (store) => {
    if (store.mossByteId === '') {
        genHelpers.runGenerator(getMossByteDbId).then((mossByteId) => {
            store.mossByteId = mossByteId;

            genHelpers.runGenerator(getRemoteTodoItemList)
                .then((result) => {
                    const mossByteTodoItemList = packRemoteTodoItemsIntoList(result);

                    if (mossByteTodoItemList.length > 0) {
                        // Perform a list merge to account for cases where client connection is slow to DB
                        const newTodoItemList = [
                            ...mossByteTodoItemList,
                            ...toJS(store.todoItemList),
                        ];

                        store.todoItemList = removeDuplicateTodoItems(newTodoItemList);
                    }
                })
                .catch((error) => {
                    throw new Error(`\nProblem with getRemoteTodoItemList:\n${error}`);
                });
        });
    }
};

/**
 * Takes a list of existing todo items in the local store and structures them into a suitable MossByte payload
 * @param {array} clientTodoList - List of todo items in the local store that need restructuring
 * @return {array} - Returns a restructured version of the todo list
 */
export const unpackTodoListForPayload = (clientTodoList) => {
    const remoteReadyPayload = {};

    clientTodoList.forEach((item) => {
        remoteReadyPayload[item.guid] = item;
    });

    return remoteReadyPayload;
};

/**
 * This is a Higher Order Generator (Yeah I made it up but it works right?) used to coordinate
 * synchronisation of the local TodoItemList with the one on the remote MossByte database server.
 * @param {object} store - MobX store
 */
export function* syncStoreWithRemote(store) {
    let remoteTodoListPayload;
    try {
        remoteTodoListPayload = yield apis.getMossByteTodoItemList(constants.baseUrl, constants.publicKey);
    } catch (error) {
        throw (error);
    }

    const packagedTodoList = packRemoteTodoItemsIntoList(remoteTodoListPayload);

    // Combine remote items with local items to ensure all items are accounted for
    const newTodoItemList = [
        ...packagedTodoList,
        ...toJS(store.todoItemList),
    ];

    // Prepare the combined todo list removing duplicate entries
    const unpackedPayload = unpackTodoListForPayload(removeDuplicateTodoItems(newTodoItemList));

    try {
        yield apis.putTodoListOnRemote(constants.baseUrl, constants.privateKey, unpackedPayload);
    } catch (error) {
        throw (error);
    }
}

/**
 * Updates the value of the new todo input item area as the user types
 * @param {object} store - Mobx store
 * @param {string} newValue - New value entered into the main input field
 */
export const updateNewTodoValue = (store, newValue) => {
    store.newTodoValue = newValue;
};

/**
 * Listens for the ENTER key and inserts a new item into the store when detected
 * @param {object} store - MobX store
 * @param {event} e - Event handler from keypress
 */
export const addNewTodoItem = (store, e) => {
    if (e.key === 'Enter') {
        store.todoItemList.push({
            value: store.newTodoValue,
            isDone: false,
            state: 1,
            guid: generateGUID(),
        });

        // Clear the input area
        updateNewTodoValue(store, '');

        genHelpers.runGenerator(syncStoreWithRemote, store);
    }
};
