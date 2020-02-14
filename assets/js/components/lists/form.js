import React              from 'react';
import { PropTypes }      from 'prop-types';
import { Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react';

import Actions              from '../../actions/lists';
import PageClick                from 'react-page-click';

export default class ListForm extends React.Component {
  componentDidMount() {
    this.refs.name.focus();
  }

  _handleSubmit(e) {
    e.preventDefault();

    const { dispatch, channel, list } = this.props;
    const { name } = this.refs;

    const data = {
      id: list ? list.id : null,
      name: name.value,
    };

    dispatch(Actions.save(channel, data));
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

  _handleCancelClick(e) {
    e.preventDefault();

    this.props.onCancelClick();
  }

  render() {
    const defaultValue = this.props.list ? this.props.list.name : '';
    const buttonText   = this.props.list ? 'Обновить список' : 'Сохранить список';

    return (
      <PageClick onClick={::this._handleCancelClick}>
        <div className="list form">
          <div className="inner">
            <form id="new_list_form" onSubmit={::this._handleSubmit}>
              <input ref="name" id="list_name" type="text" defaultValue={defaultValue} placeholder="Добавить новый список..." required="true"/>
              {::this._renderErrors('name')}
              <Button type="submit">{buttonText}</Button> или <a href="#" onClick={::this._handleCancelClick}>отмена</a>
            </form>
          </div>
        </div>
      </PageClick>
    );
  }
}

ListForm.propTypes = {
};
