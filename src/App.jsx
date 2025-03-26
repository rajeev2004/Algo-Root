import React from 'react';
import {HashRouter as Router,Routes,Route} from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Details from './components/Details';
import Notfound from './components/Notfound';
function App(){
    return (
        <Router>
            <div>
                <Routes>
                    <Route exact path="/" element={<SignUp />}/>
                    <Route path="/login" element={<Login />}/>
                    <Route path="/detailPage" element={<Details />}/>
                    <Route path="*" element={<Notfound />}/>
                </Routes>
            </div>
        </Router>
    );
}
export default App;
