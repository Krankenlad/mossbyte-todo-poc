export const checkMossByteForExistingDb = (baseUrl, publicKey) => {
    const preFlight = {
        method: 'GET',
    };

    return fetch(baseUrl + publicKey, preFlight)
        .then(response => response.json())
        .then((jsonData) => {
            if (jsonData.data && jsonData.data.mossByte && jsonData.data.mossByte.id) {
                return jsonData.data.mossByte.id;
            }

            return '';
        })
        .catch((error) => {
            console.error(error);
        });
};

export const createMossDb = (baseUrl, publicKey, privateKey) => {
    const preFlight = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            object: [
                {},
            ],
            keys: {
                read: [
                    {
                        key: publicKey,
                        label: 'mossbyte-mobx-todo-app',
                    },
                ],
                admin: [
                    {
                        key: privateKey,
                        label: 'mossbyte-mobx-todo-app',
                    },
                ],
            },
        }),
    };

    return fetch(baseUrl + publicKey, preFlight)
        .then(response => response.json())
        .then((jsonData) => {
            if (jsonData.data && jsonData.data.mossByte && jsonData.data.mossByte.id) {
                return jsonData.data.mossByte.id;
            }

            return '';
        })
        .catch((error) => {
            console.error(error);
        });
};

export const getMossByteTodoItemList = (baseUrl, publicKey) => {
    const preFlight = {
        method: 'GET',
    };

    return fetch(baseUrl + publicKey, preFlight)
        .then(response => response.json())
        .then((jsonData) => {
            if (jsonData.data && jsonData.data.mossByte && jsonData.data.mossByte) {
                return jsonData.data.mossByte;
            }

            return '';
        })
        .catch((error) => {
            console.error(error);
        });
};

export const putTodoListOnRemote = (baseUrl, privateKey, newTodoList) => {
    const preFlight = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            object: newTodoList,
        }),
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
