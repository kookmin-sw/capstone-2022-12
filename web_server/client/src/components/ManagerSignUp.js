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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {registerUser} from "../_actions/user_action";

const theme = createTheme();

export default function ManagerSignUp(props) {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const body = {
            check: 'manager',
            serial: data.get('serial'),
            m_u_id: data.get('m_u_id'),
            m_u_pw: data.get('m_u_pw'),
            m_id: data.get('m_id'),
            m_pw: data.get('m_pw'),
            m_name: data.get('m_name'),
            m_relation: data.get('m_relation'),
            m_email: data.get('m_email'),
            m_number: data.get('m_number'),
        }

        dispatch(registerUser(body)).then((response) => {
            if (response.payload.success) {
                props.history.push('/');
            } else {
                alert('회원가입에 실패했습니다.');
            }
        });
    };

    const [relation, setRelation] = React.useState('가족');

    const handleChange = (event) => {
        setRelation(event.target.value);
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
                        보호자 회원가입
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="m_id"
                                    label="보호자 아이디"
                                    name="m_id"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="m_pw"
                                    label="보호자 비밀번호"
                                    type="password"
                                    id="m_pw"
                                    autoComplete="new-password"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="name"
                                    name="m_name"
                                    required
                                    fullWidth
                                    id="m_name"
                                    label="보호자 이름"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} display={'flex'} justifyContent={'flex-start'}>
                                <FormControl fullWidth>
                                    <InputLabel id="relation">사용자와의 관계</InputLabel>
                                    <Select
                                        labelId="relation"
                                        id="m_relation"
                                        value={relation}
                                        label="사용자와의 관계"
                                        onChange={handleChange}
                                        sx={{}}
                                    >
                                        <MenuItem value={'가족'}>가족</MenuItem>
                                        <MenuItem value={'기관'}>기관</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="m_email"
                                    label="보호자 이메일"
                                    name="m_email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="m_number"
                                    label="보호자 전화번호"
                                    name="m_number"
                                    autoComplete="tel"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="serial"
                                    label="제품 번호"
                                    name="serial"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="m_u_id"
                                    label="사용자 아이디"
                                    name="m_u_id"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="m_u_pw"
                                    label="사용자 비밀번호"
                                    name="m_u_pw"
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