import { TOOGLE_ELEMENT } from "./types";

export const toggleElement = (id, hide) => {
  return {
    type: TOOGLE_ELEMENT,
    payload: { id, hide },
  };
};
