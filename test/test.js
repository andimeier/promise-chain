const promiseChain = require("../lib/index.js");

const ok = () => Promise.resolve();

const nok = () => Promise.reject("oh no");

promiseChain
  .execute({
    name: "A",
    promise: ok,
    onResolve: {
      name: "B",
      promise: nok,
      onReject: "#2"
    },
    onReject: "#1"
  })
  .then(() => {
    console.log("everything ok");
  })
  .catch(errors => {
    errors.forEach(error => {
      console.log(`${error.code}: ${error.msg}`);
    });
  });
