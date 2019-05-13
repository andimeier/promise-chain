const promiseChain = require("../lib/index.js");

const ok = () => Promise.resolve();

const nok = () => Promise.reject("oh no");

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
