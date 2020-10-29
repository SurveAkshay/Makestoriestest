
import { Route, Switch } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import Error from './components/error/Error';
import Login from './components/login/Login';
import SignUp from './components/signup/SignUp';
import UpdateAccount from './components/updateAccount/UpdateAccount';

function App() {
  return (
      <Switch>
        <Route path="/" component={SignUp} exact />
        <Route path="/login" component={Login} exact />
        <Route path="/dashboard" component={Dashboard} exact />
        <Route path="/edit" component={UpdateAccount} exact />
        <Route component={Error} />
      </Switch>
  );
}

export default App;
