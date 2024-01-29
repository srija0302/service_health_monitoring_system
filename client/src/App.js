import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from './landingPage';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Dashboard from './dashboard';

function App() {
  return (
    <div>
      <header >
        <Router>
          <Routes>
            <Route path="/" Component={LandingPage}></Route>
            <Route path="/dashboard"  Component={Dashboard}></Route>
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
