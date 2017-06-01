import React, {Component} from 'react';

class ChatBar extends Component {
  render(){
    return (
      <footer className="chatbar">
      <input className="chatbar-username" placeholder='Enter name...' defaultValue={this.props.currentUser} onBlur={this.props.leave} />
      <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyPress={this.props.enter} />
      </footer>
    );
  }
}

export default ChatBar;
