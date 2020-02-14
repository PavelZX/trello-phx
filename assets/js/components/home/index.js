import React                from 'react';
import { connect }          from 'react-redux';
//import classnames           from 'classnames';
import { Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react';

import { setDocumentTitle } from '../../utils';
import Actions              from '../../actions/boards';
import BoardCard            from '../../components/boards/card';
import BoardForm            from '../../components/boards/form';

class HomeIndexView extends React.Component {
  componentDidMount() {
    setDocumentTitle('SIM');
  }

  componentWillUnmount() {
    this.props.dispatch(Actions.reset());
  }

  _renderOwnedBoard() {
    const { fetching } = this.props;

    let content = false;

    if (!fetching) {
      content = (
        <div className="boards-wrapper">
          {::this._renderBoard(this.props.ownedBoard)}
          {::this._renderAddNewBoard()}
        </div>
      );
    }

    return (
      <Container>
        <header className="view-header">
          <h3><Icon name="spinner" /> Мои доски</h3>
        </header>
        {content}
      </Container>
    );
  }

  _renderBoard(board) {
    return board.map((board) => {
      return <BoardCard
                key={board.id}
                dispatch={this.props.dispatch}
                {...board} />;
    });
  }

  _renderAddNewBoard() {
    let { showForm, dispatch, formErrors } = this.props;

    if (!showForm) return this._renderAddButton();

    return (
      <BoardForm
        dispatch={dispatch}
        errors={formErrors}
        onCancelClick={::this._handleCancelClick}/>
    );
  }

  _renderOtherBoard() {
    const { invitedBoard } = this.props;

    if (invitedBoard.length === 0) return false;

    return (
      <Container>
        <header className="view-header">
          <h3><Icon name="users" /> Другие доски</h3>
        </header>
        <div className="boards-wrapper">
          {::this._renderBoard(invitedBoard)}
        </div>
      </Container>
    );
  }

  _renderAddButton() {
    return (
      <div className="board add-new" onClick={::this._handleAddNewClick}>
        <div className="inner">
          <a id="add_new_board">Добавить доску...</a>
        </div>
      </div>
    );
  }

  _handleAddNewClick() {
    let { dispatch } = this.props;

    dispatch(Actions.showForm(true));
  }

  _handleCancelClick() {
    this.props.dispatch(Actions.showForm(false));
  }

  render() {
    return (
      <div className="view-container boards index">
        {::this._renderOwnedBoard()}
        {::this._renderOtherBoard()}
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  state.board
);

export default connect(mapStateToProps)(HomeIndexView);
