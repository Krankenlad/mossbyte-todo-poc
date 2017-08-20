// NPM Modules
import React from 'react';
import ReactDOM from 'react-dom';
import { observable } from 'mobx';
import { Provider } from 'mobx-react';

// Components
import App, { initialState as appStore } from '../App';

// Logic
import * as logic from '../App-logic';

// Generator helpers
import * as genHelpers from '../../generator-helpers';

it('renders without crashing', () => {
    const backupRunGenerator = genHelpers.runGenerator;
    const backupUpdateClientTodoItemList = logic.updateClientTodoItemList;
    genHelpers.runGenerator = jest.fn();
    logic.updateClientTodoItemList = jest.fn();

    const div = document.createElement('div');
    let store = observable({
        appStore,
    });

    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        div,
    );

    genHelpers.runGenerator = backupRunGenerator;
    logic.updateClientTodoItemList = backupUpdateClientTodoItemList;
});
