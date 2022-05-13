import './App.css';
import {Route, Routes} from 'react-router-dom'
import SignInPage from "./SignInPage";
import SelectSignUp from "./components/SelectSignUp";
import UserSignUp from "./components/UserSignUp";
import ManagerSignUp from "./components/ManagerSignUp";
import DashboardContent from "./components/Dashboard";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path={'/'} element={<SignInPage/>}></Route>
                <Route path={'/signin'} element={<SignInPage/>}></Route>
                <Route path={'/signup'} element={<SelectSignUp/>}></Route>
                <Route path={'/usersignup'} element={<UserSignUp/>}></Route>
                <Route path={'/managersignup'} element={<ManagerSignUp/>}></Route>
                <Route path={'/dashboard'} element={<DashboardContent />}></Route>
            </Routes>
        </div>
    );
}


export default App;
