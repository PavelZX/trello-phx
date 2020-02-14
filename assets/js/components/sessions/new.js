import React, {PropTypes}   from 'react';
import { connect }          from 'react-redux';
import { Link }             from 'react-router';
import { Form, Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react';

import { setDocumentTitle } from '../../utils';
import Actions              from '../../actions/sessions';

class SessionsNew extends React.Component {
  componentDidMount() {
    setDocumentTitle('Sign in');
  }

  _handleSubmit(e) {
    e.preventDefault();

    const { email, password } = this.refs;
    const { dispatch } = this.props;

    dispatch(Actions.signIn(email.value, password.value));
  }

  _renderError() {
    let { error } = this.props;

    if (!error) return false;

    return (
      <div className="error">
        {error}
      </div>
    );
  }

  render() {
    return (
      <main>

          <Link to='/'>
          <Image src='/images/logo.png' size='small' centered/>
            </Link>

        <Form id="sign_in_form" onSubmit={::this._handleSubmit}>
        {::this._renderError()}
          <Form.Group widths={2}>
            <input
                ref="email"
                type="email"
                id="user_email"
                placeholder="Email"
                required={true}
                defaultValue="john@phoenix-trello.com" />

            <input
                ref="password"
                type="password"
                id="user_password"
                placeholder="Password"
                required={true}
                defaultValue="12345678"/>

          </Form.Group>
          <Button type="submit">Войти</Button>

        </Form>
        <Link to="/sign_up">Создать аккаунт</Link>
      </main>

    );
  }
}

const mapStateToProps = (state) => (
  state.session
);

export default connect(mapStateToProps)(SessionsNew);
