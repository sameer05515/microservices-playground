import * as BackdropActions from "./action-types";

/** `showBackdropV1` is deprecated now. please use `showBackdropV3` instead*/
export const showBackdropV1 = () => ({ type: BackdropActions.SHOW_BACKDROP_V1 });

/** `hideBackdropV1` is deprecated now. please use `hideBackdropV3` instead*/
export const hideBackdropV1 = () => ({ type: BackdropActions.HIDE_BACKDROP_V1 });

export const showBackdropV3 = (payload = { title: "", subtitle: "", description: "" }) => ({
  type: BackdropActions.SHOW_BACKDROP_V3,
  payload,
});
export const hideBackdropV3 = () => ({ type: BackdropActions.HIDE_BACKDROP_V3 });
export const updateBackdropV3 = (payload = { title: "", subtitle: "", description: "" }) => ({
  type: BackdropActions.UPDATE_BACKDROP_V3,
  payload,
});
