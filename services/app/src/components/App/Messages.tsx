import React, { Component } from "react";
import classNames from "classnames";
import { TransitionGroup, CSSTransition } from "react-transition-group";
//
import { MappedProps } from "../../containers/App/Messages";
import { Message } from "../../utils/messages";
import "./Messages.scss";
import { withTranslation, WithTranslation } from "react-i18next";

// ------------------------------------------------------------------

class Messages extends Component<MappedProps & WithTranslation> {
  public render = () => (
    <div className="Messages">
      <TransitionGroup>
        {this.props.messages.map(this.renderMessage)}
      </TransitionGroup>
    </div>
  );

  private renderMessage = (message: Message) => (
    <CSSTransition
      key={message.id}
      classNames="Message"
      timeout={{ enter: 200, exit: 200 }}
    >
      <div className={classNames("Message", "Message-" + message.type)}>
        {this.props.t(message.text)}
      </div>
    </CSSTransition>
  );
}

export default withTranslation()(Messages);
