import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {Link as RouterLink} from "react-router-dom";


function SelectSignUp(props) {
    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md">
                <CssBaseline/>
                <Box sx={{minHeight: '80vh', alignItems: 'center', display: 'flex'}}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Typography variant={'h4'} color={'primary'} fontWeight={'bold'} align={'center'}>어느 유형으로
                                가입하시나요?</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button variant={'contained'} fullWidth size={'large'} id={'user'} component={RouterLink} to="/usersignup">
                                <Typography variant={'h4'}>사용자</Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button variant={'contained'} fullWidth size={'large'} id={'manager'} component={RouterLink} to="/managersignup">
                                <Typography variant={'h4'}>보호자</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default SelectSignUp;