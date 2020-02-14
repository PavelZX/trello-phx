import React            from 'react'
import { connect }      from 'react-redux'
import BoardActions    from '../actions/boards'
import Cap           from '../components/cap'

class AuthenticatedContainer extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(BoardActions.fetchBoard())
  }

  render() {
    const { currentUser, dispatch, board, socket, currentBoard } = this.props

    if (!currentUser) return false

    return (
      <div id="authentication_container" className="application-container">
        <Cap/>

        <div className='main-container'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.session.currentUser,
  socket: state.session.socket,
  channel: state.session.channel,
  board: state.board,
  currentBoard: state.currentBoard,
});

export default connect(mapStateToProps)(AuthenticatedContainer)
