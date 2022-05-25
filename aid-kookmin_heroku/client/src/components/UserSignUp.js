import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Link as RouterLink, useNavigate} from "react-router-dom";
import axios from 'axios'

const theme = createTheme();

export default function UserSignUp() {

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const body = {
            userType: 'user',
            serial: data.get('serial'),
            userId: data.get('u_id'),
            userPw: data.get('u_pw'),
            userName: data.get('u_name'),
            userAge: data.get('u_age'),
            userAddress: data.get("u_address"),
            userTel: data.get("u_number")
        }
        axios.post('/register', body)
            .then(response => {
                if (response.data.registerSuccess) {
                    alert("회원가입이 정상적으로 완료되었습니다");
                    navigate("/");
                } else {
                    alert("기입된 정보를 다시 확인해주세요");
                }
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        사용자 회원가입
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="u_id"
                                    label="아이디"
                                    name="u_id"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="u_pw"
                                    label="비밀번호"
                                    type="password"
                                    id="u_pw"
                                    autoComplete="new-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="given-name"
                                    name="u_name"
                                    required
                                    fullWidth
                                    id="u_name"
                                    label="이름"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="u_age"
                                    label="나이"
                                    name="u_age"
                                    autoComplete="age"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="u_address"
                                    label="전화번호"
                                    name="u_address"
                                    autoComplete="tel"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="u_number"
                                    label="사용자 주소"
                                    name="u_number"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="serial"
                                    label="제품 시리얼 번호"
                                    name="serial"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            회원가입
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link component={RouterLink} to="/signin" variant="body2">
                                    이미 계정이 있으신가요? 로그인하세요
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}