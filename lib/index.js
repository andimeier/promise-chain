let config = {};

/**
 * chain and execute promises
 *
 * @param chain {*} chain of promises
 * @return {Promise} resolving on success, rejecting into a list of errors on failure
 */
function execute(chain) {
  // initialize errors
  let result = {
    errors: {},
    success: []
  };

  // sanity check
  if (!chain) {
    return;
  }

  return recurseExecution(result, chain).then(() => {
    if (Object.keys(result.errors).length) {
      return Promise.reject(result);
    } else {
      return Promise.resolve(result);
    }
  });
}

/**
 * debugging output. Will only be printed to stdout if config setting "debugOutput" is true.
 * Otherwise, this function will do nothing (stay silent)
 *
 * @param msg {string} debug text
 */
function log(msg) {
  if (config.debugOutput) {
    console.log(msg);
  }
}

/**
 * recursive execution of one promise
 *
 * @param item {ChainItem|array[ChainItem]}
 * @param result {object} result object consisting of { errors, success } which will be passed throughout the
 *   recursion (to avoid a global object and therefore be "multithreadable"). The object will be mutated.
 * @return {Promise} resolving when everything is finished (regardless whether there have been errors or not)
 */
function recurseExecution(result, item) {
  if (Array.isArray(item)) {
    // execute all items in the array
    return Promise.all(item.map(it => recurseExecution(result, it)));
  } else if (isPromise(item.promise)) {
    // execute the promise
    log(`execute chain item ${item.name}`);
    return item
      .promise()
      .then(() => {
        // success => advance to the successor
        addSuccess(result, item.name);
        if (item.onResolve) {
          log(`item [${item.name}] OK => continue with successor(s)`);
          recurseExecution(result, item.onResolve);
        }
      })
      .catch(err => {
        if (!item.onReject || item.setError) {
          addError(result, item.name, err);
        }
        if (item.onReject) {
          log(`item [${item.name}] FAIL => continue with reject successor(s)`);
          recurseExecution(result, item.onReject);
        }
        return Promise.resolve(); // silently continue at the moment ...
      });
  }
}

/**
 * add an error message (from one of the chain items)
 *
 * @param result {object} result object consisting of { errors, success } which will be passed throughout the
 *   recursion (to avoid a global object and therefore be "multithreadable"). The object will be mutated.
 * @param code {string} the error token, code or whatever you would like to call it
 * @param msg {string} the error message
 */
function addError(result, code, msg) {
  result.errors[code] = msg;
}

/**
 * add an error message (from one of the chain items)
 *
 * @param result {object} result object consisting of { errors, success } which will be passed throughout the
 *   recursion (to avoid a global object and therefore be "multithreadable"). The object will be mutated.
 * @param name {string} name of the chain item which should be registered as "executed successfully"
 */
function addSuccess(result, name) {
  result.success.push(name);
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

/**
 * set/resets debugging output
 *
 * @param debug {boolean} if true, then some debugging messages will be sent to console. If false, the lib is silent.
 */
function setDebug(debug) {
  config.debugOutput = !!debug;
}

module.exports = {
  chainify,
  execute,
  setDebug
};
