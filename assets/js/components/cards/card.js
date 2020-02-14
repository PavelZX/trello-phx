import React              from 'react';
import { PropTypes }      from 'prop-types';
import {DragSource, DropTarget} from 'react-dnd';
import { push }                 from 'react-router-redux';
import ReactGravatar            from 'react-gravatar';
import classnames               from 'classnames';
import { Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react';

import ItemTypes                from '../../constants/item_types';
import Actions                  from '../../actions/current_board';
import CardActions              from '../../actions/current_card';

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      list_id: props.list_id,
      name: props.name,
      position: props.position,
    };
  },

  isDragging(props, monitor) {
    return props.id === monitor.getItem().id;
  },
};

const cardTarget = {
  drop(targetProps, monitor) {
    const source = monitor.getItem();

    if (source.id !== targetProps.id) {
      const target = {
        id: targetProps.id,
        list_id: targetProps.list_id,
        name: targetProps.name,
        position: targetProps.position,
      };

      targetProps.onDrop({ source, target });
    }
  },
};

@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))

@DropTarget(ItemTypes.CARD, cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))

export default class Card extends React.Component {
  _handleClick(e) {
    const { dispatch, id, boardId } = this.props;

    dispatch(push(`/board/${boardId}/card/${id}`));
  }

  _renderFooter() {
    let commentIcon = null;
    const { comment, member } = this.props;

    if (comment.length > 0) {
      commentIcon = <small>
        <Icon name="comment outline"/> {comment.length}
      </small>;
    }

    const memberNodes = member.map((member) => {
      return <ReactGravatar className="react-gravatar" key={member.id} email={member.email} https />;
    });

    return (
      <footer>
        {commentIcon}
        {memberNodes}
      </footer>
    );
  }

  _renderTags() {
    const { tags } = this.props;

    const tagsNodes = tags.map((tag) => {
      return (
        <span key={tag} className={`tag ${tag}`}></span>
      );
    });

    return (
      <div className="tags-wrapper">
        {tagsNodes}
      </div>
    );
  }

  render() {
    const { id, connectDragSource, connectDropTarget, isDragging, isOver, name } = this.props;

    const styles = {
      display: isDragging ? 'none' : 'block',
    };

    const classes = classnames({
      'card': true,
      'is-over': isOver
    });

    return connectDragSource(
      connectDropTarget(
        <div id={`card_${id}`} className={classes} style={styles} onClick={::this._handleClick}>
          <div className="card-content">
            {::this._renderTags()}
            {name}
            {::this._renderFooter()}
          </div>
        </div>
      )
    );
  }
}

Card.propTypes = {
};
