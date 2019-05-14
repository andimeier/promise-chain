const { assert } = require("chai");
const _ = require('lodash');
const promiseChain = require('../lib/index.js')();

const ok = () => Promise.resolve();

const nok = () => Promise.reject("oh no");

const complexChain = [
  {
    name: "datasetPath-exists",
    promise: ok
  },
  {
    name: "algoCommit-exists",
    promise: ok,
    onReject: {
      name: "algoCommit-fetch",
      promise: ok,
      onResolve: {
        name: "algoCommit-exists2",
        promise: ok
      }
    },
  },
  {
    name: "parametersCommit-exists",
    promise: ok,
    onReject: {
      name: "parametersCommit-fetch",
      promise: ok,
      onResolve: {
        name: "parametersCommit-exists2",
        promise: ok
      }
    },
  }
];

describe("Promises", function() {
  describe("chain1", function() {
    it("should result in 2 errors", async  () => {

      debugger;
      
      const result = await promiseChain
        .execute([
          {
            name: "A",
            promise: nok,
            onReject: "#1"
          },
          {
            name: "B",
            promise: ok,
            onResolve: {
              name: "C",
              promise: nok,
              onReject: "#3"
            },
            onReject: "#2"
          }
        ]);

      assert(true, 'asdf')
        
    });
  });
});
