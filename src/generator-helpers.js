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

    Calls to runGenerator can be yielded inside another Higher Order Generator
    this will allow composing of multiple generator functions with a single .then() to handle any output

    Maybe use nested generators (HOG's) sparingly to ensure easier to read code and chances of more pure functions
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
    /*
    Check if there were any errors from the previous yield action
    
    If an error occurred as a result of the previous itObj.next() call,
    pass it back up to be handled by a try{}catch(){} in the generator
    */
    if (paramsObj.error) {
        itObj.throw(paramsObj.error);
    }

    // Progress the generator forwards by 1 yield step assigning the previous yield value to the 'yield' placeholder
    const genProgress = itObj.next(paramsObj.prevYieldValue);

    // Check the progress, triggering the callback fn if all yields have completed
    if (genProgress.done) {
        // Trigger the callback function passing in the return value of the generator
        paramsObj.cb(paramsObj.error, paramsObj.prevYieldValue);

        // Return true to exit the recursive loop as the generator has finished yielding
        return paramsObj.prevYieldValue;
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
        genProgress.value.then((resolvedValue) => {
            const newParamsObj = {
                error: paramsObj.error,
                prevYieldValue: resolvedValue,
                cb: paramsObj.cb,
            };

            nextCaller(itObj, newParamsObj);
        });
    } else {
        // This should almost never run, is here as a catcher incase unpromisified calls were yielded in the generator
        const newParamsObj = {
            error: paramsObj.error,
            prevYieldValue: genProgress.value,
            cb: paramsObj.cb,
        };

        nextCaller(itObj, newParamsObj);
    }
};

/**
 * Takes a generator function and optional arguments object
 * @param {function} genFn - The generator function to be processed 
 * @param {object} argsObj - Only used for generators that need external params passed in i.e. callback fn etc.
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
                if (typeof result === 'undefined') {
                    reject('The generator yielded function that did not return a promise i.e missing "return" before fetch()', genFn);
                } else {
                    resolve(result);
                }
            },
        };

        // Will keep calling itself until all generator yields have completed
        nextCaller(iteratorObj, paramsObj);
    });
};
