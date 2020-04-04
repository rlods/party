import React from "react";
import classNames from "classnames";
import { TransitionGroup, CSSTransition } from "react-transition-group";
//
import { MappedProps } from "../../containers/App/Messages";
import { Message } from "../../utils/messages";
import "./Messages.scss";

// ------------------------------------------------------------------

class Messages extends React.Component<MappedProps> {
  public render = () => (
    <div className="Messages">
      <TransitionGroup>
        {this.props.messages.map((message) => this.renderMessage(message))}
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
