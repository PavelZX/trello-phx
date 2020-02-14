import Constants from '../constants';

const initialState = {
  ownedBoard: [],
  invitedBoard: [],
  showForm: false,
  formErrors: null,
  ownedFetched: false,
  fetching: true,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.BOARD_FETCHING:
      return { ...state, fetching: true };

    case Constants.BOARD_RECEIVED:
      return { ...state, ownedBoard: action.ownedBoard, invitedBoard: action.invitedBoard, fetching: false };

    case Constants.BOARD_SHOW_FORM:
      return { ...state, showForm: action.show };

    case Constants.BOARD_CREATE_ERROR:
      return { ...state, formErrors: action.errors };

    case Constants.BOARD_RESET:
      return { ...state, showForm: false, formErrors: null, ownedFetched: false, fetching: false, };

    case Constants.BOARD_FULL_RESET:
      return initialState;

    case Constants.BOARD_ADDED:
      const { invitedBoard } = state;

      return { ...state, invitedBoard: [action.board].concat(invitedBoard) };

    case Constants.BOARD_NEW_BOARD_CREATED:
      const { ownedBoard } = state;

      return { ...state, ownedBoard: [action.board].concat(ownedBoard) };

    default:
      return state;
  }
}
