const ENABLE_LOGGING=true;
const logMessage = (
  phase,
  message = { title: "", data: `No data provided with this ${phase}` },
  beutify = true
) => {
  if(!ENABLE_LOGGING) return;
  if (message?.data && typeof message.data === "string") {
    console.log(
      `${phase} : '${message.title}' =======\n`,
      "data: ",
      message.data,
      "\n"
    );
  } else {
    console.log(
      `${phase} : '${message.title}', =======\n`,
      "data: ",
      JSON.stringify(message.data, null, beutify ? 2 : 0),
      "\n"
    );
  }
};

const startOperation = (message, beutify = true) => {
  if(!ENABLE_LOGGING) return;
  console.log("\n============ Starting calculations ===================");
  console.log(new Date().toString() + "\n");
  logMessage("Start", message, beutify);
};

const stepOperation = (message, beutify = true) => {
  if(!ENABLE_LOGGING) return;
  logMessage("Step", message, beutify);
};

const endOperation = (message, beutify = true) => {
  if(!ENABLE_LOGGING) return;
  logMessage("End", message, beutify);
  console.log(
    "\n############# Completing calculations #####################\n"
  );
};

module.exports = { startOperation, stepOperation, endOperation };
