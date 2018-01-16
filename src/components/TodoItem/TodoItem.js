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

// Initial State
export const initialState = {
    state: StateEnum.INCOMPLETE,
    date: "2017-01-01",
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
        this.todoStore.date = this.props.date;
        this.todoStore.isDone = this.props.isDone;
        this.todoStore.todoItemValue = this.props.value;
        this.todoStore.itemId = this.props.itemId;
        console.log(this.props);
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

    callCheckDate = (e) => {
        logic.checkDate(this.todoStore);
    }

    handleDateChange = (e) => {
        logic.updateDateValue(this.todoStore, e.target.value);
        // logic.updateDateOnRemote(this.todoStore);
    }

    render() {
        return (
            <div className="mosstodo__todo-item">
                <label className={`mosstodo__todo-item-checkbox`}>
                    <input type="checkbox" value='0' onChange={this.callCycleState} />
                </label>
                <input
                    type="date"
                    id="dateChange"
                    className={'mosstodo__date-info'}
                    value={this.todoStore.date}
                    onChange={this.handleDateChange}
                />
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
