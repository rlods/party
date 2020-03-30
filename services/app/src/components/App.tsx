import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
//
import { MappedProps } from "../containers/App";
import Party from "../containers/Party";
import Splash from "../containers/Splash";
import Modals from "../containers/Modals";

// ------------------------------------------------------------------

class App extends Component<MappedProps> {
  public componentDidMount = async () => {};

  public render = () => {
    return (
      <div className="App">
        <Modals />
        <Switch>
          <Route exact={true} path="/party/:room_id" component={Party} />
          <Route exact={true} path="/" component={Splash} />
          <Redirect to="/" />
        </Switch>
      </div>
    );
  };
}

export default App;
