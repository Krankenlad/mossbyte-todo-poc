// Generator helpers
import * as genHelpers from '../../generator-helpers';

// API Functions to interact with the database
import * as apis from './TodoItem-apis';

// Constants
import * as constants from '../../Global-constants';

/**
 * Updates the text value for a recently edited todo list item on the remote Mossbyte DB
 * @param {object} store - A specific TodoItem's MobX Store
 */
export function* updateTodoItemValueOnRemote(store) {
    const payload = {
        instructions: [
            {
                function: 'set',
                key: `${store.itemId}.value`,
                value: (store.todoItemValue.length > 0) ? store.todoItemValue : ' ',
            },
        ],
    };

    try {
        yield apis.updateValueForTodoItem(constants.baseUrl, constants.privateKey, payload);
    } catch (error) {
        throw (error);
    }
}

/**
 * Takes the new value for a todo list item and updates the old one in the remote MossByte DB
 * @param {object} store - A specific TodoItem's MobX Store
 */
export const updateRemoteItemValue = (store) => {
    genHelpers.runGenerator(updateTodoItemValueOnRemote, store);
};

/**
 * Listens for the ENTER key to be released before switching focus back to the main input area
 * This is done as an ease of access to speed up edits on todo list items
 * @param {event} e - Event handler for keyUps
 */
export const triggerBluerOnEnterKey = (e) => {
    if (e.key === 'Enter') {
        document.getElementsByClassName('mosstodo__app-todo-input')[0].focus();
    }
};

/**
 * Takes the new value for a todo list item and updates the old one in the local store
 * @param {object} store - A specific TodoItem's MobX Store
 * @param {string} newValue - The new value replacing the old todo item text
 */
export const updateTodoItemValue = (store, newValue) => {
    store.todoItemValue = newValue;
};

/**
 * Toggles the 'isDone' flag on the remote MossByte DB for the target todo list item
 * @param {object} store - A specific TodoItem's MobX Store
 */
export function* updateDoneStatusOnRemote(store) {
    const payload = {
        instructions: [
            {
                function: 'toggle',
                key: `${store.itemId}.isDone`,
            },
        ],
    };

    try {
        yield apis.updateDoneStatusForTodoItem(constants.baseUrl, constants.privateKey, payload);
    } catch (error) {
        throw (error);
    }
}

/**
 * Updates the 'isDone' value for a specific todo list item
 * @param {object} store - A specific TodoItem's MobX Store
 * @param {string} newStatus - The new status of a specific todo list item after being toggled locally
 */
export const updateDoneStatus = (store, newStatus) => {
    store.isDone = (newStatus === 'false');

    // Toggle the status on the remote DB in the background
    genHelpers.runGenerator(updateDoneStatusOnRemote, store);
};

/**
 * Takes a GUID and calls the DELETE api responsible for adjusting the remote Mossbyte DB
 * @param {string} itemId - GUID for the item being removed
 */
export function* removeTodoItemFromRemote(itemId) {
    const payload = {
        instructions: [
            {
                function: 'unset',
                key: itemId,
            },
        ],
    };

    try {
        yield apis.deleteTodoListItemOnRemote(constants.baseUrl, constants.privateKey, payload);
    } catch (error) {
        throw (error);
    }
}

/**
 * Toggles the 'isDone' flag on the remote MossByte DB for the target todo list item
 * @param {object} store - A specific TodoItem's MobX Store
 */
export function* updateStatusOnRemote(store) {
    const payload = {
        instructions: [
            {
                function: 'set',
                key: `${store.itemId}.state`,
                value: store.state,
            },
        ],
    };

    try {
        yield apis.updateDoneStatusForTodoItem(constants.baseUrl, constants.privateKey, payload);
    } catch (error) {
        throw (error);
    }
}

export const cycleState = (store) => {
    store.state = store.state + 1;
    if (store.state === 4) {
        store.state = 1;
    }

    // Toggle the status on the remote DB in the background
    genHelpers.runGenerator(updateStatusOnRemote, store);
}

/**
 * Completely removes a specific todo item from the local and remote stores
 * @param {object} appStore - The full application MobX store including sub-stores
 * @param {string} itemId - GUID for the todo list item being removed
 */
export const removeTodoItem = (appStore, itemId) => {
    // Remove the todo item from the item list
    let targetItemIndex = -1;
    appStore.todoItemList.some((item, index) => {
        targetItemIndex = index;
        return item.guid === itemId;
    });

    // Make sure the item was actually found before attempting to remove anything
    if (targetItemIndex !== -1) {
        appStore.todoItemList.splice(targetItemIndex, 1);

        // Delete the removed item's sub-store
        delete appStore[itemId];

        genHelpers.runGenerator(removeTodoItemFromRemote, itemId);
    }
};
