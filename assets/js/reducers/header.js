import Constants  from '../constants';

const initialState = {
  showBoard: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.HEADER_SHOW_BOARD:
      return { ...state, showBoard: action.show };

    default:
      return state;
  }
}
