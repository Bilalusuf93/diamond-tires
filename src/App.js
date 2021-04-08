import React from "react";
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import DashboardScreen from "./Screens/DashboardScreen";
import * as auth from "./Services/auth";
import LoginScreen from "./Screens/LoginScreen";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/dashboard" component={DashboardScreen}>
          {/* {!auth.GetUserFromLS() && <Redirect to="/" />} */}
        </Route>

        <Route path="/" component={LoginScreen}>
          {/* {auth.GetUserFromLS() && <Redirect to="dashboard" />} */}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
