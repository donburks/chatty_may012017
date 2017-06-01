import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import NavBar from './NavBar.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Don"}, 
      messages: [],
      count: 0
    }
  }

  handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      let newMessage = {username: this.state.currentUser.name, content: event.target.value};
      this.socket.send(JSON.stringify(newMessage));
      event.target.value = '';
    }
  }

  updateUser = (event) => {
    let prevName = this.state.currentUser.name;
    let newName = event.target.value;
    this.setState({currentUser:{name: newName}})
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://0.0.0.0:3001');
    this.socket.onopen = (event) => {
      console.log("Got a connection!");
    };

    this.socket.onmessage = (messageEvent) => {
      let data = JSON.parse(messageEvent.data);
      let messages = this.state.messages.concat(data);
      this.setState({messages: messages});
    };
  }

  render() {
    return (
      <div>
        <NavBar count = {this.state.count} />
        <MessageList messages={this.state.messages} />
        <ChatBar currentUser={this.state.currentUser.name} enter={this.handleKeyPress} leave={this.updateUser} />
      </div>
    );
  }
}
export default App;
