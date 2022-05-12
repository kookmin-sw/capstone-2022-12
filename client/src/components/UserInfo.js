import * as React from 'react';
import {useTheme} from '@mui/material/styles';
import Title from './Title';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function UserInfo() {
    const theme = useTheme();
    const userName = "허진우";
    return (
        <React.Fragment>
            <Title>{userName}님의 보호자</Title>
            <Grid container alignItems={'center'} display={'flex'} spacing={6}>
                <Grid item xs={12} md={6}>
                    <Typography variant={'h5'} color={'primary'}>황교민</Typography>
                    <Typography>이메일: tempmail1@gmail.com</Typography>
                    <Typography>연락처: 010-1111-1111</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant={'h5'} color={'primary'}>장민혁</Typography>
                    <Typography>이메일: tempmail2@gmail.com</Typography>
                    <Typography>연락처: 010-2222-2222</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant={'h5'} color={'primary'}>조상연</Typography>
                    <Typography>이메일: tempmail3@gmail.com</Typography>
                    <Typography>연락처: 010-3333-3333</Typography>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}