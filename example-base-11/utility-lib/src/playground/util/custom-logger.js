const logMessage = (phase, message = { title: "", data: `No data provided with this ${phase}` }) => {
  console.log(`${phase} Message: '${message.title}', data: ${JSON.stringify(message.data)}\n =======`);
};

const startOperation = (message) => {
  console.log("\n============ Starting calculations ===================");
  console.log(new Date().toString()+"\n")
  logMessage("Start", message);
};

const stepOperation = (message) => {
  logMessage("Step", message);
};

const endOperation = (message) => {
  logMessage("End", message);
  console.log("\n############# Completing calculations #####################\n");
};

module.exports = { startOperation, stepOperation, endOperation };
