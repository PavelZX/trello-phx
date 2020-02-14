import React              from 'react';
import { PropTypes }      from 'prop-types';
import { push }           from 'react-router-redux';
import { Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react';

export default class BoardCard extends React.Component {
  _handleClick() {
    this.props.dispatch(push(`/board/${this.props.id}`));
  }

  render() {
    return (
      <div id={this.props.id} className="board" onClick={::this._handleClick}>
        <div className="inner">
          <h4>{this.props.name}</h4>
        </div>
      </div>
    );
  }
}

BoardCard.propTypes = {
};
