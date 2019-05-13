var errors;

/**
 * chain and execute promises
 *
 * @param chain {*} chain of promises
 * @return {Promise} resolving on success, rejecting into a list of errors on failure
 */
function execute(chain) {
  // initialize errors
  errors = [];

  return recurseExecution(chain).then(() => {
    if (errors) {
      return Promise.reject(errors);
    } else {
      return Promise.resolve();
    }
  });
}

/**
 * recursive execution of one promise
 *
 * @param item {ChainItem|array[ChainItem]}
 * @return {Promise} resolving when everything is finished (regardless whether there have been errors or not)
 */
function recurseExecution(item) {
  if (Array.isArray(item)) {
    // execute all items in the array
    return Promise.all(item.map(it => recurseExecution(it)));
  } else if (isPromise(item.promise)) {
    // execute the promise
    console.log(`execute chain item ${item.name}`);
    return item
      .promise()
      .then(() => {
        // success => advance to the successor
        if (item.onResolve) {
          recurseExecution(item.onResolve);
        }
      })
      .catch(err => {
        if (!item.onReject) {
          throw new Error('promise returned error, but no onReject handler in place'); // brutal!
        }
        addError(item.onReject, err);
        return Promise.resolve(); // silently continue at the moment ...
      });
  }
}

/**
 * add an error message (from one of the chain items)
 *
 * @param code {string} the error token, code or whatever you would like to call it
 * @param msg {string} the error message
 */
function addError(code, msg) {
  errors.push({
    code,
    msg
  });
}

/**
 * check if the "thing" is a promise. This is simply done by checking whether the "thing" has
 * a "then" function.
 *
 * @param candidate {*} the test candidate which should be checked
 * @return {boolean} true if is a promise, false if it is not
 */
function isPromise(item) {
  //return true; // it is a not-yet-executed promise!
  //return item && typeof item.then === "function";
  return typeof item === "function";
}

/**
 * chain and execute promises
 *
 * @param promise {Promise}
 * @param onResolve {object|array[object]} chain object or chain objects to be executed on success
 * @param onReject {string} error parameter to be filled with the rejection reason on failure
 * @return {object} a chain object
 */
function chainify(promise, onResolve, onReject) {
  return {
    promise,
    onResolve,
    onReject
  };
}

module.exports = {
  chainify,
  execute
};
