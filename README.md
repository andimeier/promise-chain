# Promise-chain

This lib aims to make a network of promises easily configurable. Rejection of a promise should not lead per se to an overall rejection,
but you can define an "on reject" handler (another promise following in the "reject" case). 

## Terminology

* "chain" ... the chained promises
* "chain item" ... one promise plus its metadata for linking it within the chain

## Basic Usage

Include the lib in your app:

```js
const promiseChain = require('promise-chain');
```

You can switch on debugging output with:

```js
const promiseChain = require('promise-chain');
promiseChain.setDeubg(true);
```

## Specifying a promise chain

A "chain item" is nothing else than a promise returning function plus a couple of properties which define the chaining behavior.

Recognized properties are:

* `promise` ... {function} the promise returning function
* `onResolve` ... {ChainItem} the next chain item to be executed on success of the current item
* `onReject` ... {ChainItem} the next chain item to be executed if the current item rejects
* `name` ...{string}  an identifier string. This is used a the key for the errors object
* `setError` ... {boolean} if set, a rejected promise will even be registered in the `errors` structure of the result object if 
it has an `onReject` successor. If false,a rejected promise with a `onReject` successor will not produce an error. A rejected promise
*without* an `onReject` setting will *always* produce an error. Default is false.

Returned result object:

* `errors` ... an object consisting of all error objects of the rejected promises. Key is the chain link name (property `name`) and value is the rejection value, whatever this is
* `success` ... an array listing all resolved promises
