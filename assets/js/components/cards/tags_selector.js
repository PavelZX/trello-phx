import React              from 'react';
import { PropTypes }      from 'prop-types';
import PageClick          from 'react-page-click';
import ReactGravatar      from 'react-gravatar';
import classnames         from 'classnames';
import { Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react';

import Actions            from '../../actions/current_card';

export default class TagsSelector extends React.Component {
  _close(e) {
    e.preventDefault();

    this.props.close();
  }

  // _removeTag(tag) {
  //  const { dispatch, channel, cardId } = this.props;

  // dispatch(Actions.removeTag(channel, cardId, tag));
  // }

  _addTag(tag) {
    const { dispatch, channel, cardId, selectedTags } = this.props;

    selectedTags.push(tag);

    dispatch(Actions.updateTags(channel, cardId, selectedTags));
  }

  _removeTag(tag) {
    const { dispatch, channel, cardId, selectedTags } = this.props;

    selectedTags.splice(selectedTags.indexOf(tag), 1);

    dispatch(Actions.updateTags(channel, cardId, selectedTags));
  }

  _renderTagsList() {
    const { selectedTags } = this.props;

    const tags = ['green', 'yellow', 'orange', 'red', 'purple', 'blue'];

    const tagsNodes = tags.map((tag) => {
      const isSelected = -1 != selectedTags.indexOf(tag);

      const handleOnClick = (e) => {
        e.preventDefault();

        return isSelected ? this._removeTag(tag) : this._addTag(tag);
      };

      const linkClasses = classnames({
        selected: isSelected,
      });

      const iconClasses = classnames({
        fa: true,
        'fa-check': isSelected,
      });

      const icon = (<i className={iconClasses}/>);

      return (
        <li key={tag}>
          <a className={`tag ${tag} ${linkClasses}`} onClick={handleOnClick} href="#">
            {icon}
          </a>
        </li>
      );
    });

    return (
      <ul>
        {tagsNodes}
      </ul>
    );
  }

  render() {
    return (
      <PageClick onClick={::this._close}>
        <div className="tags-selector">
          <header>Метки <a className="close" onClick={::this._close} href="#"><Icon name="close" /></a></header>
          {::this._renderTagsList()}
        </div>
      </PageClick>
    );
  }
}

TagsSelector.propTypes = {
};
