import React                  from 'react';
import { PropTypes }          from 'prop-types';
import { connect }          from 'react-redux';
import {DragDropContext}    from 'react-dnd';
import HTML5Backend         from 'react-dnd-html5-backend';
import { Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react';

import Actions              from '../../actions/current_board';
import Constants            from '../../constants';
import { setDocumentTitle } from '../../utils';
import ListForm             from '../../components/lists/form';
import ListCard             from '../../components/lists/card';
import BoardMember           from '../../components/boards/member';

@DragDropContext(HTML5Backend)

class BoardShowView extends React.Component {
  componentDidMount() {
    const { socket } = this.props;

    if (!socket) {
      return false;
    }

    this.props.dispatch(Actions.connectToChannel(socket, this.props.params.id));
  }

  componentWillUpdate(nextProps, nextState) {
    const { socket } = this.props;
    const { currentBoard } = nextProps;

    if (currentBoard.name !== undefined) setDocumentTitle(currentBoard.name);

    if (socket) {
      return false;
    }

    this.props.dispatch(Actions.connectToChannel(nextProps.socket, this.props.params.id));
  }

  componentWillUnmount() {
    this.props.dispatch(Actions.leaveChannel(this.props.currentBoard.channel));
  }

  _renderMember() {
    const { connectedUser, showUserForm, channel, error } = this.props.currentBoard;
    const { dispatch } = this.props;
    const member = this.props.currentBoard.member;
    const currentUserIsOwner = this.props.currentBoard.user.id === this.props.currentUser.id;

    return (
      <BoardMember
        dispatch={dispatch}
        channel={channel}
        currentUserIsOwner={currentUserIsOwner}
        member={member}
        connectedUser={connectedUser}
        error={error}
        show={showUserForm} />
    );
  }

  _renderList() {
    const { list, channel, editingListId, id, addingNewCardInListId } = this.props.currentBoard;

    return list.map((list) => {
      return (
        <ListCard
          key={list.id}
          boardId={id}
          dispatch={this.props.dispatch}
          channel={channel}
          isEditing={editingListId === list.id}
          onDropCard={::this._handleDropCard}
          onDropCardWhenEmpty={::this._handleDropCardWhenEmpty}
          onDrop={::this._handleDropList}
          isAddingNewCard={addingNewCardInListId === list.id}
          {...list} />
      );
    });
  }

  _renderAddNewList() {
    const { dispatch, formErrors, currentBoard } = this.props;

    if (!currentBoard.showForm) return this._renderAddButton();

    return (
      <ListForm
        dispatch={dispatch}
        errors={formErrors}
        channel={currentBoard.channel}
        onCancelClick={::this._handleCancelClick} />
    );
  }

  _renderAddButton() {
    return (
      <div className="list add-new" onClick={::this._handleAddNewClick}>
        <div className="inner">
          Добавить список...
        </div>
      </div>
    );
  }

  _handleAddNewClick() {
    const { dispatch } = this.props;

    dispatch(Actions.showForm(true));
  }

  _handleCancelClick() {
    this.props.dispatch(Actions.showForm(false));
  }

  _handleDropCard({ source, target }) {
    const { list, channel } = this.props.currentBoard;
    const { dispatch } = this.props;

    const sourceListIndex = list.findIndex((list) => { return list.id === source.list_id; });
    const sourceList = list[sourceListIndex];
    const sourceCardIndex = sourceList.card.findIndex((card) => { return card.id === source.id; });
    const sourceCard = sourceList.card[sourceCardIndex];

    const targetListIndex = list.findIndex((list) => { return list.id === target.list_id; });
    let targetList = list[targetListIndex];
    const targetCardIndex = targetList.card.findIndex((card) => { return card.id === target.id; });
    const targetCard = targetList.card[targetCardIndex];
    const previousTargetCard = sourceList.card[sourceCardIndex + 1];

    if (previousTargetCard === targetCard) { return false; }

    sourceList.card.splice(sourceCardIndex, 1);

    if (sourceList === targetList) {
      const insertIndex = sourceCardIndex < targetCardIndex ? targetCardIndex - 1 : targetCardIndex;
      // move at once to avoid complications
      targetList = sourceList;
      sourceList.card.splice(insertIndex, 0, source);
    } else {
      // and move it to target
      targetList.card.splice(targetCardIndex, 0, source);
    }

    const newIndex = targetList.card.findIndex((card) => { return card.id === source.id; });

    const position = newIndex == 0 ? targetList.card[newIndex + 1].position / 2 : newIndex == (targetList.card.length - 1) ? targetList.card[newIndex - 1].position + 1024 : (targetList.card[newIndex - 1].position + targetList.card[newIndex + 1].position) / 2;

    const data = {
      id: sourceCard.id,
      list_id: targetList.id,
      position: position,
    };

    dispatch(Actions.updateCard(channel, data));
  }

  _handleDropList({ source, target }) {
    const { list, channel } = this.props.currentBoard;
    const { dispatch } = this.props;

    const sourceListIndex = list.findIndex((list) => { return list.id === source.id; });
    const sourceList = list[sourceListIndex];
    list.splice(sourceListIndex, 1);

    const targetListIndex = list.findIndex((list) => { return list.id === target.id; });
    const targetList = list[targetListIndex];
    list.splice(targetListIndex, 0, sourceList);

    const newIndex = list.findIndex((list) => { return list.id === source.id; });

    const position = newIndex == 0 ? list[newIndex + 1].position / 2 : newIndex == (list.length - 1) ? list[newIndex - 1].position + 1024 : (list[newIndex - 1].position + list[newIndex + 1].position) / 2;

    const data = {
      id: source.id,
      position: position,
    };

    dispatch(Actions.updateList(channel, data));
  }

  _handleDropCardWhenEmpty(card) {
    const { channel } = this.props.currentBoard;
    const { dispatch } = this.props;

    dispatch(Actions.updateCard(channel, card));
  }

  render() {
    const { fetching, name } = this.props.currentBoard;

    if (fetching) return (
      <div className="view-container boards show">
        <i className="fa fa-spinner fa-spin"/>
      </div>
    );

    return (
      <div className="view-container boards show">
        <header className="view-header">
          <h3>{name}</h3>
          {::this._renderMember()}
        </header>
        <div className="canvas-wrapper">
          <div className="canvas">
            <div className="lists-wrapper">
              {::this._renderList()}
              {::this._renderAddNewList()}
            </div>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentBoard: state.currentBoard,
  socket: state.session.socket,
  currentUser: state.session.currentUser,
});

export default connect(mapStateToProps)(BoardShowView);
