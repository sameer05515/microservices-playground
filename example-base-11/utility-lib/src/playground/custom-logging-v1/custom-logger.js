const logMessage = (prefix, messageObject = { title: "", data: "I am dummy text. please pass your data here" }) => {
  console.log(`\n====================, \n ${prefix} Message: '${messageObject.title}', result: ${JSON.stringify(messageObject.data)}\n`);
};

const onStartOperationCallback = (messageObject) => {
  console.log("\n============ Starting calculations ===================\n");
  logMessage("Start", messageObject);
};

const postStepCallback = (messageObject) => {
  logMessage("Step", messageObject);
};

const onEndOperationCallback = (messageObject) => {
  logMessage("End", messageObject);
  console.log("\n============ Completing calculations ===================\n");
};

module.exports = { onStartOperationCallback, postStepCallback, onEndOperationCallback };
