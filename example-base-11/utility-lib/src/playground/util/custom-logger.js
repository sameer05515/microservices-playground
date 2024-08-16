const ENABLE_LOGGING = false;
const SHOW_DATA = true;

const logMessage = (phase, message = { title: "", data: `No data provided with this ${phase}` }, beautify = true) => {
  if (!ENABLE_LOGGING) return;

  const { title, data } = message;
  const output = `${phase} : ${title}`;

  if (SHOW_DATA) {
    const formattedData = typeof data === "string" ? data : JSON.stringify(data, null, beautify ? 2 : 0);
    console.log(`${output}\n\n`, "data: ", formattedData, "\n");
  } else {
    console.log(`${output}\n`);
  }
};

const startOperation = (message, beautify = true) => {
  if (!ENABLE_LOGGING) return;

  console.log("\n============ Starting calculations ===================");
  console.log(new Date().toString() + "\n");
  logMessage("Start", message, beautify);
};

const stepOperation = (message, beautify = true) => {
  if (!ENABLE_LOGGING) return;
  logMessage("Step", message, beautify);
};

const endOperation = (message, beautify = true) => {
  if (!ENABLE_LOGGING) return;
  logMessage("End", message, beautify);
  console.log("\n############# Completing calculations #####################\n");
};

const getTabs = (noOfTabs = 1) => 
  noOfTabs && !isNaN(noOfTabs) && noOfTabs > 0 
      ? '\t'.repeat(noOfTabs) 
      : '';

const getHierarchyString = (nodes, noOfTabs = 1) => {
  let str = '';
  
  nodes.forEach(node => {
    str += `${getTabs(noOfTabs)}${node.name}, noOfTabs: ${noOfTabs}, node.name: ${node.name}, node.level: ${node.level}\n`;
    
    if (node.children && node.children.length > 0) {
      str += getHierarchyString(node.children, noOfTabs + 1);
    }
  });

  return str;
};


module.exports = { startOperation, stepOperation, endOperation, getHierarchyString };
