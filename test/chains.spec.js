const { assert } = require("chai");
const _ = require('lodash');
const promiseChain = require('../lib/index.js');

const ok = () => Promise.resolve();

const nok = () => Promise.reject("oh no");

describe("Promises", function() {
  describe("chain1", function() {
    it("should result in 3 errors", async  () => {
      try {
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
      } catch (e) {
        // test returned error object
        assert.equal(e.length, 13);
      }
        
    });
  });
});
