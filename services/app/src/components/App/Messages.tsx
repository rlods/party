import React from "react";
import classNames from "classnames";
import { TransitionGroup, CSSTransition } from "react-transition-group";
//
import { Message } from "../../actions/messages";
import "./Messages.scss";

// ------------------------------------------------------------------

type Props = {
  messages: Message[];
};

class Messages extends React.Component<Props> {
  public render = () => (
    <div className="Messages">
      <TransitionGroup>
        {this.props.messages.map(message => this.renderMessage(message))}
      </TransitionGroup>
    </div>
  );

  public renderMessage(message: Message) {
    return (
      <CSSTransition
        key={message.id}
        classNames="Message"
        timeout={{ enter: 200, exit: 200 }}
      >
        <div className={classNames("Message", "Message-" + message.type)}>
          {message.text}
        </div>
      </CSSTransition>
    );
  }
}

export default Messages;
