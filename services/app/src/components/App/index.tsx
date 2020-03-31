import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
//
import { MappedProps } from "../../containers/App";
import Room from "../../containers/Rooms/Room";
import Splash from "../../containers/Splash";
import Modals from "../../containers/Modals";
import Messages from "../../containers/App/Messages";

// ------------------------------------------------------------------

class App extends Component<MappedProps> {
  public componentDidMount = async () => {
    this.props.onReconnect();
  };

  public render = () => {
    return (
      <div className="App">
        <Modals />
        <Switch>
          <Route exact={true} path="/room/:room_id" component={Room} />
          <Route exact={true} path="/" component={Splash} />
          <Redirect to="/" />
        </Switch>
        <Messages />
      </div>
    );
  };
}

export default App;
