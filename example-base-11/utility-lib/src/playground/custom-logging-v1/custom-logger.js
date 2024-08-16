const logMessage = (phase, message = { title: "", data: "I am dummy text. Please pass your data here" }) => {
  console.log(`\n====================\n ${phase} Message: '${message.title}', result: ${JSON.stringify(message.data)}\n`);
};

const startOperation = (message) => {
  console.log("\n============ Starting calculations ===================\n");
  logMessage("Start", message);
};

const stepOperation = (message) => {
  logMessage("Step", message);
};

const endOperation = (message) => {
  logMessage("End", message);
  console.log("\n============ Completing calculations ===================\n");
};

module.exports = { startOperation, stepOperation, endOperation };
