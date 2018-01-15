// NPM Modules
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

// Styles
import './TodoItem.css';

// Logic
import * as logic from './TodoItem-logic';

// Enum for states
var StateEnum = {
    NONE : 0,
    INCOMPLETE : 1,
    IN_PROGRESS : 2,
    COMPLETE : 3
}

// var StateNameEnum = {
//     INCOMPLETE : "INCOMPLETE",
//     IN_PROGRESS : "IN IN_PROGRESS",
//     COMPLETE : "COMPLETE"
// }

// Initial State
export const initialState = {
    state: StateEnum.INCOMPLETE,
    isDone: false,
    todoItemValue: '',
    itemId: '',
};

export default inject('store')(observer(class TodoItem extends Component {
    constructor(props) {
        super(props);

        // Enables store subscribed, dynamically instantiated, child components..
        // Redux needs an ugly / hackish workaround to achieve the same outcome
        this.todoStore = this.props.store.appStore[this.props.itemId];

        this.todoStore.state = this.props.state;
        this.todoStore.isDone = this.props.isDone;
        this.todoStore.todoItemValue = this.props.value;
        this.todoStore.itemId = this.props.itemId;
    }

    callUpdateDoneStatus = (e) => {
        logic.updateDoneStatus(this.todoStore, e.target.value);
    }

    callCycleState = (e) => {
        logic.cycleState(this.todoStore);
    }

    callUpdateTodoItemValue = (e) => {
        logic.updateTodoItemValue(this.todoStore, e.target.value);
    }

    callRemoveTodoItem = () => {
        logic.removeTodoItem(this.props.store.appStore, this.todoStore.itemId);
    }

    callUpdateRemoteItemValue = () => {
        logic.updateRemoteItemValue(this.todoStore);
    }

    callTriggerBlurOnEnterKey = (e) => {
        logic.triggerBluerOnEnterKey(e);
    }

    render() {
        return (
            <div className="mosstodo__todo-item">
                <label className={`mosstodo__todo-item-checkbox${(this.todoStore.isDone && ' --done') || ''}`}>
                    <input type="checkbox" value={this.todoStore.isDone} onChange={this.callUpdateDoneStatus} />
                </label>
                <button className="mosstodo__todo-cycle-complete" onClick={this.callCycleState}>x</button>
                <p className="mosstodo__temp">
                {this.todoStore.state}
                </p>
                <input
                    type="text"
                    className={`mosstodo__todo-item-${this.todoStore.state}`}
                    placeholder="Enter your fitness goal"
                    onChange={this.callUpdateTodoItemValue}
                    value={this.todoStore.todoItemValue}
                    onKeyUpCapture={this.callTriggerBlurOnEnterKey}
                    onBlur={this.callUpdateRemoteItemValue}
                />
                <button className="mosstodo__todo-delete-item" onClick={this.callRemoveTodoItem}>x</button>
            </div>
        );
    }
}));
