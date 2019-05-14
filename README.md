# Promise-chain

## Terminology

* "chain" ... the chained promises
* "chain item" ... one promise plus its metadata for linking it within the chain

## Basic Usage

Include the lib in your app:

    const promiseChain = require('promise-chain');

You can also pass an optional config object

    const promiseChain = require('promise-chain')({
        debugOutput: true
    });

## Configuration

The configurable options which can be passed via the config objects at `require` time are:

* `debugOutput` ... if set to true, the lib will output some debugging messages during execution of the promises

## Specifying a promise chain

A "chain item" is nothing else than a promise returning function plus a couple of properties which define the chaining behavior.

Recognized properties are:

* `promise` ... {function} the promise returning function
* `onResolve` ... {ChainItem} the next chain item to be executed on success of the current item
* `onReject` ... {ChainItem} the next chain item to be executed if the current item rejects
* `name` ...{string}  an identifier string. This is used a the key for the errors object
* `noError` ... {boolean} if not set, a rejected promise will be registered in the `errors` structure of the result object. 
If true, the rejection will be silently ignored (in this case, usually a `onRejecty` property makes sense to continue with some next chain item which could work around the error somehow). Default is false.

Returned result object:

* `errors` ... an object consisting of all error objects of the rejected promises. Key is the chain link name (property `name`) and value is the rejection value, whatever this is
* `success` ... an array listing all resolved promises
