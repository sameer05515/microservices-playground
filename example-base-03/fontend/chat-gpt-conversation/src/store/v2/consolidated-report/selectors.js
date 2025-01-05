// Base selector for consolidatedReport
export const selectCRReport = (state) => state.crReport;

const selectNodeListData = (state) => selectCRReport(state).nodeList.data || [];

/**
 * A higher-order selector to retrieve the `type` of a node by its `uniqueId`.
 *
 * @param {string} uniqueId - The unique identifier of the node for which the type is required.
 * @returns {function} A selector function that takes the Redux state as an argument.
 * 
 * Inspired By:
 * - [colorSelectors-v1.js](../colors/colorSelectors-v1.js)
 * - [colorSelectors-v2.js](../colors/colorSelectors-v2.js)
 *
 * @example
 * // State shape
 * const state = {
 *   crReport: {
 *     nodeList: {
 *       data: [
 *         { uniqueId: "123", type: "Topic", name: "Introduction" },
 *         { uniqueId: "456", type: "SubTopic", name: "React Basics" }
 *       ]
 *     }
 *   }
 * };
 *
 * // Using the selector
 * const type = getTypeForUniqueId("123")(state); // Output: "Topic"
 * 
 * @see
 * Please see details [here](../colors/read-me.md)
 * 
 */
export const getTypeForUniqueId = (uniqueId) => (state) => {
  const node = selectNodeListData(state).find((d) => d.uniqueId === uniqueId);
  return node ? node.type : null;
};
