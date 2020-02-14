import Constants from '../constants';

const Actions = {
  showForm: (show) => {
    return dispatch => {
      dispatch({
        type: Constants.LIST_SHOW_FORM,
        show: show,
      });
    };
  },

  save: (channel, data) => {
    return dispatch => {
      const topic = data.id ? 'list:update' : 'list:create';

      channel.push(topic, { list: data });
    };
  },

  createCard: (channel, data) => {
    return dispatch => {
      channel.push('card:create', { card: data });
    };
  },
};

export default Actions;
