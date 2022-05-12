import './App.css';
import SignUpPage from "./SignUpPage";
import {Slide} from "@mui/material";

function App() {
  return (
    <div className="App">
        <Slide direction="up">
            <SignUpPage/>
        </Slide>
    </div>
  );
}

export default App;
