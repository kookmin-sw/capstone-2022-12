import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Link as RouterLink, useNavigate} from 'react-router-dom'
import * as axios from 'axios';


const theme = createTheme();

export default function SignIn() {
    const navigate = useNavigate();
    const [chk, setChk] = React.useState('user');

    const handleSwitch = (e) => {
        if (e.currentTarget.checked) {
            setChk("user");
        } else {
            setChk("manager");
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const body = {
            chk: chk,
            id: data.get('id'),
            pw: data.get('pw'),
        }

        axios.post("/login", body)
        .then(response => {
            const data = response.data;
            console.log("로그인 서버 응답")
            console.log(data);
            navigate("/dashboard", {state:{
                name: data.name,
                chk: data.chk,
                is_logined: data.is_logined,
                serial: data.serial
            }});
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, backgroundColor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        로그인
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <Switch
                            onChange={handleSwitch}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="id"
                            label="아이디"
                            name="id"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="pw"
                            label="비밀번호"
                            type="password"
                            id="pw"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary"/>}
                            label="아이디 기억하기"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            onSubmit={handleSubmit}
                        >
                            로그인하기
                        </Button>
                        <Grid container justifyContent={'flex-between'}>
                            <Grid item xs={12}>
                                <Link component={RouterLink} to="/signup" variant="body2">
                                    {"아직 회원이 아니신가요?"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}