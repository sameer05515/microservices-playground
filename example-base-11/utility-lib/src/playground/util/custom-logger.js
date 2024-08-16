const logMessage = (phase, message = { title: "", data: `No data provided with this ${phase}` }, beutify = false) => {
  console.log(`${phase} Message: '${message.title}', data: ${JSON.stringify(message.data, null, beutify ? 2 : 0)}\n =======`);
};

const startOperation = (message, beutify = false) => {
  console.log("\n============ Starting calculations ===================");
  console.log(new Date().toString() + "\n")
  logMessage("Start", message, beutify);
};

const stepOperation = (message, beutify = false) => {
  logMessage("Step", message, beutify);
};

const endOperation = (message, beutify = false) => {
  logMessage("End", message, beutify);
  console.log("\n############# Completing calculations #####################\n");
};

module.exports = { startOperation, stepOperation, endOperation };
