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
import {RadioGroup, Radio} from "@mui/material";


const theme = createTheme();

export default function SignIn() {
    const navigate = useNavigate();
    const [userType, setUserType] = React.useState('user');

    const handleRadioChange = (event) => {
        setUserType(event.currentTarget.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const body = {
            userType: userType,
            id: data.get('id'),
            pw: data.get('pw'),
        }
        console.log("request to server with");
        console.log(body);

        await axios.post("http://localhost:80/login", body)
            .then(response => {
                console.log("response from server with")
                const data = response.data;
                console.log(data);
                if (data.loginSuccess) {
                    navigate("/dashboard", {
                        state: {
                            currentId: data.id,
                            userType: userType,
                            userSerials: data.userSerials,
                            userNames: data.userNames,
                            userTels: data.userTels,
                        }
                    });
                } else {
                    alert("잘못된 회원 정보입니다!");
                }
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
                        <Box display={'flex'} width={1.0} justifyContent={'center'}>
                            <RadioGroup
                                row
                                defaultValue={'user'}
                                name={'userType'}
                                onChange={handleRadioChange}
                            >
                                <FormControlLabel control={<Radio/>} label={'사용자'} value={'user'}/>
                                <FormControlLabel control={<Radio/>} label={'보호자'} value={'manager'}/>
                            </RadioGroup>
                        </Box>
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