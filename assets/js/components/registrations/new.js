import React   from 'react';
import { connect }          from 'react-redux';
import { Link }             from 'react-router';
import { Form, Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react';

import { setDocumentTitle, renderErrorsFor } from '../../utils';
import Actions              from '../../actions/registrations';

class RegistrationsNew extends React.Component {
  componentDidMount() {
    setDocumentTitle('Sign up');
  }

  _handleSubmit(e) {
    e.preventDefault();

    const { dispatch } = this.props;

    const data = {
      first_name: this.refs.firstName.value,
      last_name: this.refs.lastName.value,
      email: this.refs.email.value,
      password: this.refs.password.value,
      password_confirmation: this.refs.passwordConfirmation.value,
    };

    dispatch(Actions.signUp(data));
  }

  render() {
    const { errors } = this.props;

    return (
      <main>

        <Link to='/'>
        <Image src='/images/logo.png' size='small' centered/>
          </Link>
 

        <Form success>
          <Form.Group widths={2}>
            <Form.Input id="user_first_name" type="text" placeholder="Имя" required={true}  />
            {renderErrorsFor(errors, 'first_name')}
            <Form.Input id="user_last_name" type="text" placeholder="Фамилия" required={true} />
            {renderErrorsFor(errors, 'last_name')}
          </Form.Group>
          <Form.Group widths={2}>
            <Form.Input id="user_email" type="email" placeholder="Электронная почта" required={true} />
            {renderErrorsFor(errors, 'email')}
            <Form.Input placeholder="Страна"/>
          </Form.Group>
          <Form.Group widths={2}>
            <Form.Input id="user_password" type="password" placeholder="Пароль" required={true} />
            {renderErrorsFor(errors, 'password')}
            <Form.Input id="user_password_confirmation" type="password" placeholder="Повторить пароль" required={true} />
            {renderErrorsFor(errors, 'password_confirmation')}
          </Form.Group>
          <Button type="submit">Регистрация</Button>

        </Form>
        <Link to="/sign_in">Войти</Link>
        </main>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.registration.errors,
});

export default connect(mapStateToProps)(RegistrationsNew);
