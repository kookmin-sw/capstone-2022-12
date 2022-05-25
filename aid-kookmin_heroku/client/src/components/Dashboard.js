import * as React from 'react';
import {useEffect, useState} from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Emotion from './Emotion';
import Orders from './Orders';
import {useLocation} from 'react-router';
import Avatar from "@mui/material/Avatar";
import Title from "./Title";
import {Fab, Popover, Radio, RadioGroup, Zoom} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "axios";
import AddUserPopup from "./AddUserPopup";

const mdTheme = createTheme();

function DashboardContent() {
    const location = useLocation();
    console.log("dashboard information from server");
    console.log(location.state);

    const userType = location.state.userType;
    const currentId = location.state.currentId;
    const userSerials = location.state.userSerials;
    const userNames = location.state.userNames;
    const userTels = location.state.userTels;

    const [userInfo, setUserInfo] = useState(
        {
            lastTimes: [],
            lastEmotions: [],
            lastTexts: [],
            userStatus: {
                depressed: 0,
                not_depressed: 0
            }
        }
    );

    const [userIdx, setUserIdx] = useState(userType === 'user'? 0 : -1);


    useEffect(async () => {
        const body = {
            userType: userType,
            serial: userSerials[userIdx],
        }

        if (userIdx === -1) {
            return;
        }

        console.log(`request user serial ${body.serial} to server`);
        console.log(body);
        await axios.post("/info", body).then(
            response => {
                console.log(`received ${userSerials[userIdx]} info from server`);
                console.log(response.data);
                setUserInfo({
                        lastTimes: response.data.lastTime,
                        lastEmotions: response.data.lastEmotion,
                        lastTexts: response.data.lastText,
                        userStatus: response.data.userStatus
                    }
                )
            }
        )
    }, [userIdx]);


    const handleSelect = (e) => {
        setUserIdx(e.currentTarget.value);
    }

    const [anchorEl, setAnchorEl] = React.useState(false);
    const open = Boolean(anchorEl);
    const floatId = anchorEl ? 'addUser' : undefined;
    const handleFabClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFapClose = () => {
        setAnchorEl(null);
    };

    const renderViaType = () => {
        if (userType === "manager") {
            return (
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                        <Box>
                            <Title>사용자 선택</Title>
                            <RadioGroup onChange={handleSelect}>
                                {userNames.map((name, idx) => (
                                    <FormControlLabel
                                        key={`userRadio${idx}`}
                                        value={idx}
                                        label={name}
                                        control={<Radio/>}/>))
                                }
                            </RadioGroup>
                            <Fab color={'primary'} aria-label={floatId} variant={'extended'}
                                 aria-describedby={floatId}
                                 onClick={handleFabClick}
                            >
                                <AddIcon/>
                                사용자 추가하기
                            </Fab>
                            <Popover
                                id={floatId}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleFapClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <AddUserPopup currentId={currentId}/>
                            </Popover>
                        </Box>
                    </Paper>
                </Grid>
            );
        }
    }

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{display: 'block'}}>
                <CssBaseline/>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar/>
                    <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
                        <Grid container spacing={3} alignItems={'stretch'} justifyContent={'ceneter'}>
                            <Grid item xs={12} display={'block'}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Avatar
                                        sx={{width: '12vh', height: '12vh'}}
                                        src={'pic.jpg'}
                                    />
                                    <Typography
                                        variant={'h4'}
                                        p={2}
                                        fontWeight={'bold'}
                                    >환영합니다 {currentId}님!</Typography>
                                </Paper>
                            </Grid>
                            {renderViaType()}
                            <Zoom in={userIdx !== -1}>
                                <Grid item xs={6}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: 260
                                        }}
                                    >
                                        <Emotion
                                            user={userNames[userIdx]}
                                            depressed={userInfo.userStatus.depressed}
                                            notDepressed={userInfo.userStatus.not_depressed}
                                        />
                                    </Paper>
                                </Grid>
                            </Zoom>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    <Orders
                                        lastTimes={userInfo.lastTimes}
                                        lastEmotions={userInfo.lastEmotions}
                                        lastTexts={userInfo.lastTexts}
                                    />
                                </Paper>
                            </Grid>
                            {/* Recent Talk */}
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default function Dashboard() {
    return <DashboardContent/>;
}