const { assert, fail } = require("chai");
const chai = require("chai");
const _ = require("lodash");
const promiseChain = require("../lib/index.js");

const ok = () => Promise.resolve();

const nok = () => Promise.reject("oh no");

/**
 * check if the given object is actually a failed Chai assertion
 *
 * @param obj {object} the object to be tested
 * @return {boolean} true if the object is a Chai assertion result, false if not
 */
function isFailedAssertion(obj) {
  let keys = Object.keys(obj);
  return (
    typeof obj === "object" &&
    keys.includes("actual") &&
    keys.includes("expected")
  );
}

const complexChain = [
  {
    name: "datasetPath-exists",
    promise: ok
  },
  {
    name: "algoCommit-exists",
    promise: nok,
    noError: true,
    onReject: {
      name: "algoCommit-fetch",
      promise: ok,
      onResolve: {
        name: "algoCommit-exists2",
        promise: ok
      }
    }
  },
  {
    name: "parametersCommit-exists",
    promise: ok,
    noError: true,
    onReject: {
      name: "parametersCommit-fetch",
      promise: ok,
      onResolve: {
        name: "parametersCommit-exists2",
        promise: ok
      }
    }
  }
];

describe("Promises", function() {
  describe("simple chain", function() {
    it("should execute successfully", async () => {
      try {
        const result = await promiseChain.execute([
          {
            name: "A",
            promise: nok
          },
          {
            name: "B",
            promise: ok,
            onResolve: {
              name: "C",
              promise: nok
            }
          }
        ]);

        assert.fail(
          "you should never land here since this would mean that the chain was not rejected"
        );
      } catch (e) {
        if (isFailedAssertion(e)) {
          assert.fail("promise was not rejected");
        }
        assert.hasAllKeys(e.errors, ["A", "C"]);
      }
    });
  });

  describe("rejection message", function() {
    it("should be 'my message'", async () => {
      const msg = "my message";

      try {
        await promiseChain.execute({
          name: "A",
          promise: () => Promise.reject(msg)
        });

        assert.fail(
          "you should never land here since this would mean that the chain was not rejected"
        );
      } catch (e) {
        if (isFailedAssertion(e)) {
          assert.fail("promise was not rejected");
        }
        assert.hasAllKeys(e.errors, ["A"]);
        assert.equal(e.errors.A, msg);
      }
    });
  });

  describe("onReject handling", function() {
    it("should call the 'onReject' successor", async () => {
      const msg = "my message";

      const result = await promiseChain.execute({
        name: "A",
        promise: () => Promise.reject(msg),
        onReject: {
          name: "onReject-successor",
          promise: ok
        }
      });

      assert.sameMembers(result.success, ["onReject-successor"]);
    });
  });

  describe("complex chain", function() {
    it("should execute successfully", async () => {
      await promiseChain.execute(complexChain);

      assert.isTrue(true);
    });
  });

  describe("complex chain2", function() {
    it("should result in 2 errors", async () => {
      try {
        await promiseChain.execute([
          {
            name: "datasetPath-exists",
            promise: nok
          },
          {
            name: "algoCommit-exists",
            promise: nok,
            noError: true,
            onReject: {
              name: "algoCommit-fetch",
              promise: ok,
              onResolve: {
                name: "algoCommit-exists2",
                promise: nok
              }
            }
          },
          {
            name: "parametersCommit-exists",
            promise: ok,
            noError: true,
            onReject: {
              name: "parametersCommit-fetch",
              promise: ok,
              onResolve: {
                name: "parametersCommit-exists2",
                promise: ok
              }
            }
          }
        ]);

        assert.fail(
          "you should never land here since this would mean that the chain was not rejected"
        );
      } catch (e) {
        if (isFailedAssertion(e)) {
          assert.fail("promise was not rejected");
        }
        assert.hasAllKeys(e.errors, [
          "datasetPath-exists",
          "algoCommit-exists2"
        ]);
      }
    });
  });
});
