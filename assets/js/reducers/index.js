import { combineReducers }  from 'redux';
import { routerReducer }    from 'react-router-redux';
import session              from './session';
import registration         from './registration';
import board             from './board';
import currentBoard         from './current_board';
import currentCard          from './current_card';
import cap               from './cap';

export default combineReducers({
  routing: routerReducer,
  session: session,
  registration: registration,
  board: board,
  currentBoard: currentBoard,
  currentCard: currentCard,
  cap: cap,
});
