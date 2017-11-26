/*
    These are some small generator helpers I wrote to auto run the .next() calls
    on yielded actions inside a generator.

    Ideally generators should only be yielding things that return a promise
    a.k.a Promisified function calls like fetch

    To get started:
    import { runGenerator } from '../path_to_this_file/generator-helpers';

    USAGE EXAMPLE:
    ==============
    // Generator function
    export function* getMossByteDbId(constants) {
        try {
            let mossByteId = yield apis.checkMossByteForExistingDb(constants.baseUrl, constants.publicKey);

            if (mossByteId === '') {
                mossByteId = yield apis.createMossDb(constants.baseUrl, constants.publicKey, constants.privateKey);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const argsObj = {
        baseUrl: 'https://whatever/',
        publicKey: '45687sfa-F324-a879aa55',
        privateKey: 'asdfa121fa-875-33141124-a879aa55',
    }

    runGenerator(getMossByteDbId).then(result => console.log(result));

    =================================

    Calls to runGenerator can be yielded inside a Higher Order Generator function.
    (async version of a regular H.O.F used to coordinate pure functions)

    HOGs combine multiple generator functions used to produce a final result.
    They enhance readability by replacing nested .then() chains with a flat yield structure.

    The final value derived by the last yield / return in a HOG can be accessed from a single .then() chain.
*/

/**
 * Takes a variable and checks that its constructor (base class) is an "Object"
 * instead of being a "Date", "Null", "Array", etc.
 * @param {object} variable - Should have "Object" as the constructor
 * @return {bool} - Only returns true if "Object" is the variable's constructor
 */
export const isRealObject = (variable) => {
    return (
        typeof variable === 'object' &&
        Object.prototype.toString.call(variable).slice(8, -1) === 'Object'
    );
};

/**
 * Takes a variable and checks that its constructor (base class) is an "Array"
 * instead of being a "Date", "Null", "Object", etc.
 * @param {array} variable - Should have "Array" as the constructor
 * @return {bool} - Only returns true if "Array" is the variable's constructor
 */
export const isRealArray = (variable) => {
    return (
        typeof variable === 'object' &&
        Object.prototype.toString.call(variable).slice(8, -1) === 'Array'
    );
};

/**
 * Recursively calls itself to trigger .next() on the itterable object.
 * Waits for the yielded promise (async fn) to resolve before triggering .next() again
 * @param {object} itObj - Itterable object that has the .next() and .throw() methods
 * @param {object} paramsObj - Wrapper for params:
 *          - {object} paramsObj.error - Caught errors that may have bubbled up from a failed async fn (not yet implemented)
 *          - {any} paramsObj.prevYieldValue - Value returned by the resolved promise
 *          - {function} paramsObj.cb - Callback function used to pass the finalYieldValue back out via a promise
 */
export const nextCaller = (itObj, paramsObj) => {
    // Error kill switch
    if (paramsObj.error) {
        paramsObj.cb(paramsObj.error, paramsObj.prevYieldValue);

        // Exits recursive loop by calling the iterator object's built in throw method
        itObj.throw(paramsObj.error);
    }

    // Progress the generator forwards by 1 yield step assigning the previous yield value to the 'yield' placeholder
    const genProgress = itObj.next(paramsObj.prevYieldValue);

    // Check the progress, triggering the callback fn if all yields have completed
    if (genProgress.done && paramsObj.prevYieldValue) {
        // Trigger the callback function passing in the return value of the generator
        paramsObj.cb(paramsObj.error, paramsObj.prevYieldValue);

        // Return to exit the recursive loop as the generator has finished yielding
        return undefined;
    }

    /*
        If the function has not exited yet it means either:
        - There are more yields in the generator to process
        or
        - This is our last yield so calling itObj.next().done will === true
    */
    const genProgValueIsPromise = (
        typeof genProgress.value === 'object' &&
        Object.getPrototypeOf(genProgress.value) !== null &&
        Object.getPrototypeOf(genProgress.value).toString().slice(8, -1) === 'Promise'
    );

    // If genProgress.value is a promise, async pause execution till it resolves
    if (genProgValueIsPromise) {
        genProgress.value
            .then((resolvedValue) => {
                const newParamsObj = {
                    error: paramsObj.error,
                    prevYieldValue: resolvedValue,
                    cb: paramsObj.cb,
                };

                nextCaller(itObj, newParamsObj);
            })
            .catch((error) => {
                const newParamsObj = {
                    error,
                    prevYieldValue: null,
                    cb: paramsObj.cb,
                };

                nextCaller(itObj, newParamsObj);
            });
    } else {
        // This should almost never run, is here as a catcher incase unpromisified calls were yielded in the generator
        const newParamsObj = {
            error: (
                `The generator yielded a function that did not return a promise i.e:
    - Missing "return" before fetch()
    - Fetch never returns anything
    - Non-async function yielded
    - etc.`
            ),
            prevYieldValue: genProgress.value,
            cb: paramsObj.cb,
        };

        nextCaller(itObj, newParamsObj);
    }

    return undefined;
};

/**
 * Takes a generator function and optional arguments object
 * @param {function} genFn - The generator function to be processed 
 * @param {object} argsObj - Only used for generators that need external params passed in i.e. callback fn etc.
 * @return {promise} - Promisified response that can be accessed using .then and .catch enabling HOGs (Higher Order Generators)
 */
export const runGenerator = (genFn, argsObj = null) => {
    return new Promise((resolve, reject) => {
        let iteratorObj;

        // Check if the generator had any arguments
        if (argsObj !== null) {
            iteratorObj = genFn(argsObj);
        } else {
            iteratorObj = genFn();
        }

        const paramsObj = {
            cb: (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            },
        };

        // Will keep calling itself until all generator yields have completed
        nextCaller(iteratorObj, paramsObj);
    });
};
