import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class Message extends Component {
  parseType() {
    switch(this.props.message.type) { 
      case 'myMessage': 
        return (<span className="message-content myMessage">{this.props.message.content}</span>);
        break;
      case 'errorMessage':
        return (<span className="message-content error">{this.props.message.content}</span>);
        break;
      case 'gifMessage':
        return (<span className="message-content"><img className="gif" src={this.props.message.content} alt="Don't sue." /></span>);
        break;
      case 'collapseMessage': 
        let gifs = document.querySelectorAll(".gif");
        gifs.forEach((gif) => {
          gif.style.height = '0px';
        });
        return (<span className="message-content">{this.props.message.content}</span>);
        break;
      case 'expandMessage': 
        let nogifs = document.querySelectorAll(".gif");
        nogifs.forEach((gif) => {
          gif.style.height = '256px';
        });
        return (<span className="message-content">{this.props.message.content}</span>);
        break; 
      default:
        return (<span className="message-content">{this.props.message.content}</span>);
        break;
    } 
  }
  render(){
    return (
      <div className="message">
        <span className="message-username">{this.props.message.username}</span>
        {this.parseType()} 
      </div>
    );
  }
}
export default Message;

