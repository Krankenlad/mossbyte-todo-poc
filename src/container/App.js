// NPM Modules
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ScrollArea from 'react-scrollbar';

// Styles
import './App.css';

// Logic
import * as logic from './App-logic';

// Components
import TodoItem, { initialState as todoItemStore } from '../components/TodoItem/TodoItem';

// Initial State
export const initialState = {
    newTodoValue: '',
    todoItemList: [],
    hintStatus: ' --on',
    mossByteId: '',
};


export default inject('store')(observer(class App extends Component {
    constructor(props) {
        super(props);

        this.appStore = this.props.store.appStore;
    }

    componentDidMount = () => {
        logic.updateClientTodoItemList(this.appStore);
    }

    handleNewTodoValueChange = (e) => {
        logic.updateNewTodoValue(this.appStore, e.target.value);
        logic.updateAppHintStatus(this.appStore, e.target.value);
    }

    handleNewTodoSubmit = (e) => {
        logic.addNewTodoItem(this.appStore, e);
        logic.updateAppHintStatus(this.appStore, this.appStore.newTodoValue);

    }

    handleDateChange = (e) => {
        logic.updateDateValue(this.appStore, e.target.value);
        document.getElementById("todoInput").focus();
    }

    render() {
        return (
            <div className="mosstodo__app">
                <p className="mosstodo__app-intro">
                    MossByte MobX Todo App
                </p>
                <div className="mosstodo__app-input-wrapper">
                    <p className={`mosstodo__app-hint${this.appStore.hintStatus}`}>
                        Enter your fitness goals below
                        <span>Press {'<ENTER>'} to save your new goal !</span>
                    </p>
                    <input
                        id="todoInput"
                        className="mosstodo__app-todo-input"
                        placeholder="What to do next ?"
                        onChange={this.handleNewTodoValueChange}
                        onKeyUpCapture={this.handleNewTodoSubmit}
                        value={this.appStore.newTodoValue}
                        autoFocus
                    />
                </div>
                <div>
                    <input
                        id="dateID"
                        type="date" 
                        onChange={this.handleDateChange}
                        onKeyUpCapture={this.handleNewTodoSubmit}
                    />
                </div>
                <div className="mosstodo__app-todo-items-wrapper">
                    <ScrollArea
                        className="mosstodo__app-todo-items-outer-frame"
                        contentClassName="mosstodo__app-todo-items-inner-frame"
                        horizontal={false}
                    >
                        {logic.generateTodoItems(this.appStore, todoItemStore, TodoItem)}
                    </ScrollArea>
                </div>
            </div>
        );
    }
}));
