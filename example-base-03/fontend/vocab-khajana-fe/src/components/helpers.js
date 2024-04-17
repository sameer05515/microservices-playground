// helpers.js

export const getNextIndex = (currIndex, arrayLength, exerciseObjectList) => {
    const max = arrayLength || exerciseObjectList.length;
    return (currIndex + max + 1) % max;
};

export const runTimer = (delay, exerciseObjectList) => {
    if (delay <= 0) {
        // Implement timer logic
    } else {
        // Implement timer logic
    }
};


///////////////////////////

// const exerciseNode = 'exerciseNode';
// const exerciseHeaderNode = 'exerciseHeaderNode';
// const exerciseAllowedTimeNode = 'currentExerciseNodeAllowedTimeToDisplay';
// const exerciseImageListNode = 'exerciseNodeImageList';
// const exerciseContainerNode = 'exerciseNodeContainer';

// let exerciseObjectList = [];

// let selectedExerciseNodeIndex = 0;
// let selectedExerciseNodeImageIndex = 0;

// const showExerciseNode = (node) => {
//     $(`#${node.exerciseContainerNodeID}`).show();
//     $(`#${node.excerciseID}`).show();
// };

// const hideExerciseNode = (node) => {
//     for (let i = 0; i <= node.imageIDList.length; i++) {
//         const imgDivID = node.imageIDList[i];
//         $(`#${imgDivID}`).hide();
//     }
//     $(`#${node.excerciseID}`).hide();
//     $(`#${node.exerciseContainerNodeID}`).hide();
// };

// const fetchAllImageNodes = (node) => {
//     const allowedTimeToDisplay = `${exerciseImageListNode}${node.excerciseID.substr(exerciseNode.length)}`;
//     const allImageDivIDs = [];
//     $(`#${allowedTimeToDisplay}`).children('div').each(function() {
//         const imageKiID = $(this).attr('id');
//         allImageDivIDs.push(imageKiID);
//     });
//     return allImageDivIDs;
// };

// const loadPreviousWord = () => {
//     hideExerciseNode(exerciseObjectList[selectedExerciseNodeIndex]);
//     let secondPrevious = (selectedExerciseNodeIndex + (exerciseObjectList.length) - 2) % (exerciseObjectList.length);
//     secondPrevious = parseInt(secondPrevious);
//     selectedExerciseNodeIndex = secondPrevious;
//     delay = -1;
// };

// const loadNext50Word = () => {
//     hideExerciseNode(exerciseObjectList[selectedExerciseNodeIndex]);
//     let secondPrevious = (selectedExerciseNodeIndex + (exerciseObjectList.length) + 49) % (exerciseObjectList.length);
//     secondPrevious = parseInt(secondPrevious);
//     selectedExerciseNodeIndex = secondPrevious;
//     delay = -1;
// };

// // const getNextIndex = (currIndex, arrayOfObj) => {
// //     const max = (count == 0) ? arrayOfObj.length : count;
// //     let nxt = offset + (currIndex + (max) + 1) % (max);
// //     nxt = parseInt(nxt);
// //     return nxt;
// // };

// const showNextImage = (node) => {
//     hideSelectedImageDiv();
//     selectedExerciseNodeImageIndex = getNextIndex(selectedExerciseNodeImageIndex, node.imageIDList);
//     showSelectedImageDiv();
// };

// const showSelectedImageDiv = () => {
//     const selNode = exerciseObjectList[selectedExerciseNodeIndex];
//     $(`#${selNode.imageIDList[selectedExerciseNodeImageIndex]}`).show();
// };

// const hideSelectedImageDiv = () => {
//     const selNode = exerciseObjectList[selectedExerciseNodeIndex];
//     $(`#${selNode.imageIDList[selectedExerciseNodeImageIndex]}`).hide();
// };

// const showNextExerciseAndImages = () => {
//     let allowedTimeVal = 0;
//     allowedTimeVal = exerciseObjectList[selectedExerciseNodeIndex].allowedTime;
//     delay = parseInt(allowedTimeVal);
//     selectedExerciseNodeImageIndex = 0;

//     showExerciseNode(exerciseObjectList[selectedExerciseNodeIndex]);
//     showSelectedImageDiv();
//     runTimer();
// };
