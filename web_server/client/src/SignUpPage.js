import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import {createTheme} from "@mui/material";
import Box from "@mui/material/Box";
import * as React from 'react';
import {useState} from "react";
import SelectSignUp from "./components/SelectSignUp";
import UserSignUp from "./components/UserSignUp";
import ManagerSignUp from "./components/ManagerSignUp";

function SignUpPage() {
    const theme = createTheme();

    const [page, setPage] = useState('select');

    const renderPage = () => {
        if (page === "select") {
            return <SelectSignUp setPage={setPage}/>;
        } else if (page === 'user') {
            return <UserSignUp/>;
        } else if (page === 'manager') {
            return <ManagerSignUp/>;
        } else {
            return <SelectSignUp/>;
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                {renderPage()}
            </CssBaseline>
        </ThemeProvider>
    );
}

export default SignUpPage;