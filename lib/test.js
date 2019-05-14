/**
 * helper module for doing some manual tests.
 * For official unit tests, use 'npm test' to run the test suite.
 */

const promiseChain = require("./index.js");

const ok = () => Promise.resolve();

const nok = () => Promise.reject("oh no");

const complexChain1 = {
  name: "datasetPath-exists",
  promise: nok,
  //setError: true,
  onReject: {
    name: "fallback",
    promise: ok
  }
};
/*
  ,
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
*/

const complexChain2 = [
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

//promiseChain.execute(complexChain1);

promiseChain.execute(complexChain1).then((result) => {
  console.log("Success!");
}).catch(e => {
  console.log("There have been errors!");
  console.log(`errors: ${JSON.stringify(e)}`);
});

return;

promiseChain
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
  ])
  .then(() => {
    console.log("everything ok");
  })
  .catch(errors => {
    console.log("There have been errors:");
    errors.forEach(error => {
      console.log(`${error.code}: ${error.msg}`);
    });
  });

return;

promiseChain
  .execute([
    {
      name: "A",
      promise: ok,
      onResolve: {
        name: "B",
        promise: ok,
        onReject: "#2"
      },
      onReject: "#1"
    },
    {
      name: "C",
      promise: ok,
      onResolve: {
        name: "D",
        promise: ok,
        onReject: "#4"
      },
      onReject: "#3"
    }
  ])
  .then(() => {
    console.log("everything ok");
  })
  .catch(errors => {
    errors.forEach(error => {
      console.log(`${error.code}: ${error.msg}`);
    });
  });
