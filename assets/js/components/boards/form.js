import React                  from 'react';
import { PropTypes }          from 'prop-types';
import { Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react';

import Actions                from '../../actions/boards';
import PageClick              from 'react-page-click';
import { renderErrorsFor }    from '../../utils';

export default class BoardForm extends React.Component {
  componentDidMount() {
    this.refs.name.focus();
  }

  _handleSubmit(e) {
    e.preventDefault();

    const { dispatch } = this.props;
    const { name } = this.refs;

    const data = {
      name: name.value,
    };

    dispatch(Actions.create(data));
  }

  _handleCancelClick(e) {
    e.preventDefault();

    this.props.onCancelClick();
  }

  render() {
    const { errors } = this.props;

    return (
      <PageClick onClick={::this._handleCancelClick}>
        <div className="board form">
          <div className="inner">
            <h4>Добавить доску</h4>
            <form id="new_board_form" onSubmit={::this._handleSubmit}>
              <input ref="name" id="board_name" type="text" placeholder="Имя доски" required="true"/>
              {renderErrorsFor(errors, 'name')}
              <Button type="submit">Создать доску</Button> или <a href="#" onClick={::this._handleCancelClick}>отмена</a>
            </form>
          </div>
        </div>
      </PageClick>
    );
  }
}
