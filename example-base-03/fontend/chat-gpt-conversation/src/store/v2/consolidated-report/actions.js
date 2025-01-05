import { isValidString } from "../../../common/utils/basic-validations";
import ConsolidatedServiceApis from "../../../common/utils/ConsolidatedServiceApis/v1";
import { prepareErrorMessage } from "../../../common/utils/message-preparation-utils-v2";
import * as CRActions from "./action-types";

// actions/sectionActions.js
export const fetchNodeList = () => {
  return async (dispatch) => {
    dispatch({ type: CRActions.LOADING_FETCH_NODE_LIST });
    try {
      const { data, isError, message } = await ConsolidatedServiceApis.fetchAllSectionsV7();
      if (!isError) {
        dispatch({
          type: CRActions.SUCCESS_FETCH_NODE_LIST,
          payload: data,
        });
      } else {
        throw new Error(`Error occurred while fetching sections data: ${message}`);
      }
    } catch (error) {
      const errorMessage = prepareErrorMessage(
        error,
        `An unexpected error occurred while fetching sections data`
      );
      dispatch({
        type: CRActions.ERROR_FETCH_NODE_LIST,
        error: errorMessage,
      });
    }
  };
};

export const fetchSelectedNodeDetails = (uniqueId, type) => {
  return async (dispatch) => {
    dispatch({ type: CRActions.LOADING_FETCH_SELECTED_NODE_DETAILS });
    try {
      if (!isValidString(uniqueId) || !isValidString(type)) {
        throw new Error(`Invalid uniqueId: ${uniqueId} or type: ${type}`);
      }

      const { data, isError, message } = await ConsolidatedServiceApis.fetchAllSectionDetailsV2({
        uniqueId,
        type,
      });
      if (!isError) {
        dispatch({
          type: CRActions.SUCCESS_FETCH_SELECTED_NODE_DETAILS,
          payload: data,
        });
      } else {
        throw new Error(`Error occurred while fetching selected node details: ${message}`);
      }
    } catch (error) {
      const errorMessage = prepareErrorMessage(
        error,
        `An unexpected error occurred while fetching selected node details`
      );
      dispatch({
        type: CRActions.ERROR_FETCH_SELECTED_NODE_DETAILS,
        error: errorMessage,
      });
    }
  };
};
