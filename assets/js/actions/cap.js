import Constants              from '../constants';
import { push }               from 'react-router-redux';
import { httpGet, httpPost }  from '../utils';
import CurrentBoardActions    from './current_board';

const Actions = {
  showBoard: (show) => {
    return dispatch => {
      dispatch({
        type: Constants.CAP_SHOW_BOARD,
        show: show,
      });
    };
  },

  visitBoard: (socket, channel, boardId) => {
    return dispatch => {
      if (channel) {
        dispatch(CurrentBoardActions.leaveChannel(channel));
        dispatch(CurrentBoardActions.connectToChannel(socket, boardId));
      }

      dispatch(push(`/board/${boardId}`));

      dispatch({
        type: Constants.CAP_SHOW_BOARD,
        show: false,
      });
    };
  },
};

export default Actions;
