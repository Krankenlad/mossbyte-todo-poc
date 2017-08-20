// NPM Modules
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { observable } from 'mobx';

// CRA Boilerplate
import registerServiceWorker from './registerServiceWorker';

// Components
import App, { initialState as appStore } from './container/App';

// Styles
import './index.css';

let store = observable({
    appStore
});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
