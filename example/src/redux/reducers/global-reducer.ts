import { GlobalActions } from '../type';

const initialState: {
  hasNetwork: boolean;
} = {
  hasNetwork: false,
};

export const globalReducer = (
  state = initialState,
  action: { type: GlobalActions; payload: any },
) => {
  switch (action.type) {
    case GlobalActions.HasNetwork:
      return {
        ...state,
        hasNetwork: action.payload as boolean,
      };
    default:
      return state;
  }
};
