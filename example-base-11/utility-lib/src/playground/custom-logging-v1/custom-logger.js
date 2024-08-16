const onStartOperationCallback = (
  messageObject = {
    title: "",
    data: "I am dummy text. please pass your data here",
  }
) => {
  console.log("\n============ Starting calculations ===================", "\n");
  console.log(
    `\n ====================, \n Start Message: '${
      messageObject.title
    }', result : ${JSON.stringify(
      messageObject.data
    )}`
  );
};

const postStepCallback= (messageObject = {
  title: "",
  data: "I am dummy text. please pass your data here",
})=>{
  console.log(
    `\n ====================, \n Step Message: '${
      messageObject.title
    }', result : ${JSON.stringify(
      messageObject.data
    )}`
  );
}

const onEndOperationCallback = (
  messageObject = {
    title: "",
    data: "I am dummy text. please pass your data here",
  }
) => {
  console.log(
    `\n ====================, \n End Message: '${
      messageObject.title
    }', result: ${JSON.stringify(
      messageObject.data
    )}`
  );
  console.log("\n============ Completing calculations ===================", "\n");
};


module.exports= {onStartOperationCallback, onEndOperationCallback, postStepCallback};