import { ActionTyp } from "./types";

export const toggleElement = (id: string, hide: boolean) => {
  return {
    type: ActionTyp.TOOGLE_ELEMENT,
    payload: { id, hide },
  };
};
