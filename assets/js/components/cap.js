import React            from 'react';
import { connect }      from 'react-redux';
import { Link }         from 'react-router';
import ReactGravatar    from 'react-gravatar';
import { push }         from 'react-router-redux';
import { Button, Divider, Dropdown, Container, Grid, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react';

import SessionActions   from '../actions/sessions';
import CapActions    from '../actions/cap';

class Cap extends React.Component {
  _handleBoardClick(e) {
    e.preventDefault();

    const { dispatch } = this.props;
    const { ownedBoard, invitedBoard } = this.props.board;

    if (ownedBoard.length != 0 || invitedBoard.length != 0) {
      dispatch(CapActions.showBoard(true));
    } else {
      dispatch(push('/'));
    }
  }

  _renderBoard() {
    const { dispatch, currentBoard, socket, cap } = this.props;

    if (!cap.showBoard) return false;

    const { ownedBoard, invitedBoard } = this.props.board;

    const ownedBoardItems = ownedBoard.map((board) => {
      return this._createBoardItem(dispatch, currentBoard, socket, board);
    });

    const ownedBoardItemsCap = ownedBoardItems.length > 0 ? <header className="title"><Icon name="user"/> Собственные доски</header> : null;

    const invitedBoardItems = invitedBoard.map((board) => {
      return this._createBoardItem(dispatch, currentBoard, socket, board);
    });

    const invitedBoardItemsCap = invitedBoardItems.length > 0 ? <header className="title"><Icon name="users"/> Другие доски</header> : null;

    return (
      <Dropdown>
        <Dropdown.Menu>
          <Dropdown.Item> {ownedBoardItemsCap} </Dropdown.Item>
          <Dropdown.Item> {ownedBoardItems} </Dropdown.Item>
          <Dropdown.Item> {invitedBoardItemsCap} </Dropdown.Item>
          <Dropdown.Item> {invitedBoardItems} </Dropdown.Item>
          <Dropdown.Item as={Link} to="/"  onClick={::this._hideBoard}> Показать все доски </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  _hideBoard() {
    const { dispatch } = this.props;
    dispatch(CapActions.showBoard(false));
  }

  _createBoardItem(dispatch, currentBoard, socket, board) {
    const onClick = (e) => {
      e.preventDefault();

      if (currentBoard.id != undefined && currentBoard.id == board.id) {
        dispatch(CapActions.showBoard(false));
        return false;
      }

      dispatch(CapActions.visitBoard(socket, currentBoard.channel, board.id));
    };

    return (
      <li key={board.id}>
        <Label as='a' href="#" onClick={onClick}>{board.name}</Label>
      </li>
    );
  }

  _renderCurrentUser() {
    const { currentUser } = this.props;

    if (!currentUser) {
      return false;
    }

    const fullName = [currentUser.first_name, currentUser.last_name].join(' ');

    return (
      <Label as='a'>
        <ReactGravatar email={currentUser.email} true="true" /> {fullName}
      </Label>
    );
  }

  _renderSignOutLink() {
    if (!this.props.currentUser) {
      return false;
    }

    return (
      <Label as='a' href="#" onClick={::this._handleSignOutClick}><Icon name="sign out"/> Выйти</Label>
    );
  }

  _handleSignOutClick(e) {
    e.preventDefault();

    this.props.dispatch(SessionActions.signOut());
  }

  render() {
    return (
      <header>
        <Grid columns={5} relaxed>
          <Grid.Column>
            <Segment basic>
            
            <Label as='a' href="#" onClick={::this._handleBoardClick}><Icon name="heartbeat"/> Доски</Label>
              {::this._renderBoard()}
            </Segment>
          </Grid.Column> 
                   
          <Grid.Column>
            <Link to='/'>
              <Image src='/images/logo.png' size='small' />
            </Link>
          </Grid.Column>
          <Grid.Column>
            <Segment basic>
              {this._renderCurrentUser()}
            </Segment>
          </Grid.Column>
          <Grid.Column>
          <Segment basic>
            {this._renderSignOutLink()}
          </Segment>
        </Grid.Column>
      </Grid>
    </header>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.session.currentUser,
  socket: state.session.socket,
  board: state.board,
  currentBoard: state.currentBoard,
  cap: state.cap,
});

export default connect(mapStateToProps)(Cap);
