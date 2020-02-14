import React                  from 'react';
import { PropTypes }          from 'prop-types';
import { connect }        from 'react-redux';
import { Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react';

import CardModal          from '../../components/cards/modal';
import Actions            from '../../actions/current_card';

class CardShowView extends React.Component {
  componentDidMount() {
    const { dispatch, params } = this.props;

    dispatch(Actions.showCard(this._getCard(params.id[1])));
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(Actions.reset());
  }

  _getCard(id) {
    let card = [];
    this.props.currentBoard.list.forEach((list) => { card = card.concat(list.card); });

    return card.find((c) => { return c.id === +id;  });
  }

  render() {
    const { channel, currentUser, dispatch, currentCard, currentBoard } = this.props;

    if (!currentCard.card) return false;

    const { card, edit, showMemberSelector, showTagsSelector } = currentCard;

    return (
      <CardModal
        boardId={currentBoard.id}
        boardMember={currentBoard.member}
        channel={channel}
        currentUser={currentUser}
        dispatch={dispatch}
        card={card}
        edit={edit}
        showMemberSelector={showMemberSelector}
        showTagsSelector={showTagsSelector} />
    );
  }
}

CardShowView.propTypes = {
};

const mapStateToProps = (state) => ({
  currentCard: state.currentCard,
  currentBoard: state.currentBoard,
  currentUser: state.session.currentUser,
  channel: state.currentBoard.channel,
});

export default connect(mapStateToProps)(CardShowView);
