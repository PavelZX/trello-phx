import React              from 'react';
import { PropTypes }      from 'prop-types';
import { Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react';

import Actions              from '../../actions/lists';
import PageClick            from 'react-page-click';

export default class CardForm extends React.Component {
  _handleSubmit(e) {
    e.preventDefault();

    let { dispatch, channel } = this.props;
    let { name }              = this.refs;

    let data = {
      list_id: this.props.listId,
      name: name.value,
    };

    dispatch(Actions.createCard(channel, data));
    this.props.onSubmit();
  }

  _renderErrors(field) {
    const { errors } = this.props;

    if (!errors) return false;

    return errors.map((error, i) => {
      if (error[field]) {
        return (
          <div key={i} className="error">
            {error[field]}
          </div>
        );
      }
    });
  }

  componentDidMount() {
    this.refs.name.focus();
  }

  _handleCancelClick(e) {
    e.preventDefault();

    this.props.onCancelClick();
  }

  render() {
    return (
      <PageClick onClick={::this._handleCancelClick}>
        <div className="card form">
          <form id="new_card_form" onSubmit={::this._handleSubmit}>
            <textarea ref="name" id="card_name" type="text" required="true" rows={5}/>
            {::this._renderErrors('name')}
            <Button type="submit">Добавить</Button> или <a href="#" onClick={::this._handleCancelClick}>отмена</a>
          </form>
        </div>
      </PageClick>
    );
  }
}

CardForm.propTypes = {
};
