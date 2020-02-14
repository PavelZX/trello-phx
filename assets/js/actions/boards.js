import Constants              from '../constants';
import { push }               from 'react-router-redux';
import { httpGet, httpPost }  from '../utils';
import CurrentBoardActions    from './current_board';

const Actions = {
  fetchBoard: () => {
    return dispatch => {
      dispatch({ type: Constants.BOARD_FETCHING });

      httpGet('/api/v1/board')
      .then((data) => {
        dispatch({
          type: Constants.BOARD_RECEIVED,
          ownedBoard: data.owned_board,
          invitedBoard: data.invited_board,
        });
      });
    };
  },

  showForm: (show) => {
    return dispatch => {
      dispatch({
        type: Constants.BOARD_SHOW_FORM,
        show: show,
      });
    };
  },

  create: (data) => {
    return dispatch => {
      httpPost('/api/v1/board', { board: data })
      .then((data) => {
        dispatch({
          type: Constants.BOARD_NEW_BOARD_CREATED,
          board: data,
        });

        dispatch(push(`/board/${data.id}`));
      })
      .catch((error) => {
        error.response.json()
        .then((json) => {
          dispatch({
            type: Constants.BOARD_CREATE_ERROR,
            errors: json.errors,
          });
        });
      });
    };
  },

  reset: () => {
    return dispatch => {
      dispatch({
        type: Constants.BOARD_RESET,
      });
    };
  },
};

export default Actions;
