import React              from 'react';
import { PropTypes }      from 'prop-types';
import ReactGravatar      from 'react-gravatar';
import PageClick          from 'react-page-click';
import moment             from 'moment';
import { push }           from 'react-router-redux';
import { Button, Divider, Container, Grid, Header, Icon,
  Image, Item, Label, Menu, Segment, Step, Table, Modal } from 'semantic-ui-react';

import Actions            from '../../actions/current_card';
import BoardActions       from '../../actions/current_board';
import MemberSelector    from './member_selector';
import TagsSelector       from './tags_selector';

export default class CardModal extends React.Component {
  componentDidUpdate() {
    const { edit } = this.props;

    if (edit) this.refs.name.focus();
  }

  _closeModal(e) {
    e.preventDefault();

    const { dispatch, boardId } = this.props;

    dispatch(push(`/board/${boardId}`));
  }

  _renderCommentForm() {
    const { currentUser } = this.props;

    return (
      <div className="form-wrapper">
        <form onSubmit={::this._handleCommentFormSubmit}>
          <header>
            <h4>Добавить заметку</h4>
          </header>
          <div className="gravatar-wrapper">
            <ReactGravatar className="react-gravatar" email={currentUser.email} https />
          </div>
          <div className="form-controls">
            <textarea
              ref="commentText"
              rows="5"
              placeholder="Написать заметку..."
              required="true"/>
            <Button type="submit">Сохранить заметку</Button>
          </div>
        </form>
      </div>
    );
  }

  _handleCommentFormSubmit(e) {
    e.preventDefault();

    const { id } = this.props.card;
    const { channel, dispatch } = this.props;
    const { commentText } = this.refs;

    const comment = {
      card_id: id,
      text: commentText.value.trim(),
    };

    dispatch(Actions.createCardComment(channel, comment));

    commentText.value = '';
  }

  _renderComment(card) {
    if (card.comment.length == 0) return false;

    const comment = card.comment.map((comment) => {
      const { user } = comment;

      return (
        <div key={comment.id} className="comment">
          <div className="gravatar-wrapper">
            <ReactGravatar className="react-gravatar" email={user.email} https />
          </div>
          <div className="info-wrapper">
            <h5>{user.first_name}</h5>
            <div className="text">
              {comment.text}
            </div>
            <small>{moment(comment.inserted_at).fromNow()}</small>
          </div>
        </div>
      );
    });

    return (
      <div className="comments-wrapper">
        <h4>Заметки</h4>
        {comment}
      </div>
    );
  }

  _handleHeaderClick(e) {
    e.preventDefault();

    const { dispatch } = this.props;
    dispatch(Actions.editCard(true));
  }

  _handleCancelClick(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(Actions.editCard(false));
  }

  _handleFormSubmit(e) {
    e.preventDefault();

    const { name, description } = this.refs;

    const { card } = this.props;

    card.name = name.value.trim();
    card.description = description.value.trim();

    const { channel, dispatch } = this.props;

    dispatch(BoardActions.updateCard(channel, card));
  }

  _renderHeader() {
    const { card, edit } = this.props;

    if (edit) {
      return (
        <header className="editing">
          <form onSubmit={::this._handleFormSubmit}>
            <input
              ref="name"
              type="text"
              placeholder="Title"
              required="true"
              defaultValue={card.name} />
            <textarea
              ref="description"
              type="text"
              placeholder="Описание карточки"
              rows="5"
              defaultValue={card.description} />
            <Button type="submit">Записать карточку</Button> или <a href="#" onClick={::this._handleCancelClick}>отмена</a>
          </form>
        </header>
      );
    } else {
      return (
        <header>
          <h3>{card.name}</h3>
          <div className="items-wrapper">
            {::this._renderMember()}
            {::this._renderTags()}
          </div>
          <h5>Описание</h5>
          <p>{card.description}</p>
          <a href="#" onClick={::this._handleHeaderClick}>изменить</a>
        </header>
      );
    }
  }

  _renderMember() {
    const { member } = this.props.card;

    if (member.length == 0) return false;

    const memberNodes = member.map((member) => {
      return <ReactGravatar className="react-gravatar" key={member.id} email={member.email} https />;
    });

    return (
      <div className="card-members">
      <h5>Участники</h5>
        {memberNodes}
      </div>
    );
  }

  _renderTags() {
    const { tags } = this.props.card;

    if (tags.length == 0) return false;

    const tagsNodes = tags.map((tag) => {
      return <div key={tag} className={`tag ${tag}`}></div>;
    });

    return (
      <div className="card-tags">
      <h5>Метки</h5>
        {tagsNodes}
      </div>
    );
  }

  _handleShowMemberClick(e) {
    e.preventDefault();

    const { dispatch } = this.props;

    dispatch(Actions.showMemberSelector(true));
  }

  _handleShowTagsClick(e) {
    e.preventDefault();

    const { dispatch } = this.props;

    dispatch(Actions.showTagsSelector(true));
  }

  _renderMemberSelector() {
    const { card, boardMember, showMemberSelector, dispatch, channel } = this.props;
    const { member } = card;

    if (!showMemberSelector) return false;

    return (
      <MemberSelector
        channel={channel}
        cardId={card.id}
        dispatch={dispatch}
        boardMember={boardMember}
        selectedMember={member}
        close={::this._onMemberSelectorClose} />
    );
  }

  _onMemberSelectorClose() {
    const { dispatch } = this.props;

    dispatch(Actions.showMemberSelector(false));
  }

  _renderTagsSelector() {
    const { card, showTagsSelector, dispatch, channel } = this.props;
    const { tags } = card;

    if (!showTagsSelector) return false;

    return (
      <TagsSelector
        channel={channel}
        cardId={card.id}
        dispatch={dispatch}
        selectedTags={tags}
        close={::this._onTagsSelectorClose} />
    );
  }

  _onTagsSelectorClose() {
    const { dispatch } = this.props;

    dispatch(Actions.showTagsSelector(false));
  }

  render() {
    const { card, boardMember, showMemberSelector } = this.props;
    const { member } = card;

    return (
      <div className="md-overlay">
        <div className="md-modal">
          <PageClick onClick={::this._closeModal}>
            <div className="md-content card-modal">
              <a className="close" href="#" onClick={::this._closeModal}>
                <Icon name="close" />
              </a>
              <div className="info">
                {::this._renderHeader()}
                {::this._renderCommentForm()}
                {::this._renderComment(card)}
              </div>
              <div className="options">
                <h4>Добавить</h4>
                <a className="button" href="#" onClick={::this._handleShowMemberClick}>
                  <Icon name="users"/> Участники
                </a>
                {::this._renderMemberSelector()}
                <a className="button" href="#" onClick={::this._handleShowTagsClick}>
                  <Icon name="tags"/> Метки
                </a>
                {::this._renderTagsSelector()}
              </div>
            </div>
          </PageClick>
        </div>
      </div>
    );
  }
}

CardModal.propTypes = {
};
