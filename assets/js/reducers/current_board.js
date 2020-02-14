import Constants  from '../constants';

const initialState = {
  connectedUser: [],
  channel: null,
  showForm: false,
  showUserForm: false,
  editingListId: null,
  addingNewCardInListId: null,
  error: null,
  fetching: true,
};

export default function reducer(state = initialState, action = {}) {
  let list;

  switch (action.type) {
    case Constants.CURRENT_BOARD_FETCHING:
      return { ...state, fetching: true };

    case Constants.BOARD_SET_CURRENT_BOARD:
      return { ...state, editingListId: null, fetching: false, ...action.board };

    case Constants.CURRENT_BOARD_CONNECTED_USER:
      return { ...state, connectedUser: action.user };

    case Constants.CURRENT_BOARD_CONNECTED_TO_CHANNEL:
      return { ...state, channel: action.channel };

    case Constants.CURRENT_BOARD_SHOW_FORM:
      return { ...state, showForm: action.show };

    case Constants.CURRENT_BOARD_SHOW_MEMBER_FORM:
      return { ...state, showUserForm: action.show, error: false };

    case Constants.CURRENT_BOARD_RESET:
      return initialState;

    case Constants.CURRENT_BOARD_LIST_CREATED:
      list = state.list;
      list.push(action.list);

      return { ...state, list: list, showForm: false };

    case Constants.CURRENT_BOARD_CARD_CREATED:
      list = state.list;
      const { card } = action;

      const listIndex = list.findIndex((list) => { return list.id == card.list_id; });
      list[listIndex].card.push(card);

      return { ...state, list: list };

    case Constants.CURRENT_BOARD_MEMBER_ADDED:
      const { member } = state;
      member.push(action.user);

      return { ...state, member: member, showUserForm: false };

    case Constants.CURRENT_BOARD_ADD_MEMBER_ERROR:
      return { ...state, error: action.error };

    case Constants.CURRENT_BOARD_EDIT_LIST:
      return { ...state, editingListId: action.listId };

    case Constants.CURRENT_BOARD_SHOW_CARD_FORM_FOR_LIST:
      return { ...state, addingNewCardInListId: action.listId };

    default:
      return state;
  }
}
