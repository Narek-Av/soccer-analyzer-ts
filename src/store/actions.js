import { SELECT_ELEMENT, DROP_ELEMENT } from "./types";

export const selectElement = (id) => {
  return {
    type: SELECT_ELEMENT,
    payload: id,
  };
};

export const dropElement = (id) => {
  return {
    type: DROP_ELEMENT,
    payload: id,
  };
};
