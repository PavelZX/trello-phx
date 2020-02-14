import { IndexRoute, Route }        from 'react-router';
import React                        from 'react';
import MainLayout                   from '../components/main';
import AuthenticatedContainer       from '../containers/authenticated';
import HomeIndexView                from '../components/home';
import RegistrationsNew             from '../components/registrations/new';
import SessionsNew                  from '../components/sessions/new';
import BoardShowView               from '../components/boards/show';
import CardShowView                from '../components/cards/show';
import Actions                      from '../actions/sessions';

export default function configRoutes(store) {
  const _ensureAuthenticated = (nextState, replace, callback) => {
    const { dispatch } = store;
    const { session } = store.getState();
    const { currentUser } = session;

    if (!currentUser && localStorage.getItem('phoenixAuthToken')) {
      dispatch(Actions.currentUser());
    } else if (!localStorage.getItem('phoenixAuthToken')) {
      replace('/sign_in');
    }

    callback();
  };

  return (
    <Route component={MainLayout}>
      <Route path="/sign_up" component={RegistrationsNew} />
      <Route path="/sign_in" component={SessionsNew} />

      <Route path="/" component={AuthenticatedContainer} onEnter={_ensureAuthenticated}>
        <IndexRoute component={HomeIndexView} />

        <Route path="/board/:id" component={BoardShowView}>
          <Route path="card/:id" component={CardShowView}/>
        </Route>
      </Route>
    </Route>
  );
}
