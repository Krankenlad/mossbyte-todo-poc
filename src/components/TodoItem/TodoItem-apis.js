export const deleteTodoListItemOnRemote = (baseUrl, privateKey, instructionsPayload) => {
    const preFlight = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(instructionsPayload),
    };

    return fetch(baseUrl + privateKey, preFlight)
        .then(response => response.json())
        .then((jsonData) => {
            return jsonData.status;
        })
        .catch((error) => {
            console.error(error);
        });
};

export const updateDoneStatusForTodoItem = (baseUrl, privateKey, instructionsPayload) => {
    const preFlight = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(instructionsPayload),
    };

    return fetch(baseUrl + privateKey, preFlight)
        .then(response => response.json())
        .then((jsonData) => {
            return jsonData.status;
        })
        .catch((error) => {
            console.error(error);
        });
};

export const updateValueForTodoItem = (baseUrl, privateKey, instructionsPayload) => {
    const preFlight = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(instructionsPayload),
    };

    return fetch(baseUrl + privateKey, preFlight)
        .then(response => response.json())
        .then((jsonData) => {
            return jsonData.status;
        })
        .catch((error) => {
            console.error(error);
        });
};
