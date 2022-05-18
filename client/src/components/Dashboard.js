import * as React from 'react';
import {useEffect} from 'react';
import {createTheme, styled, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Emotion from './Emotion';
import Orders from './Orders';
import {useLocation} from 'react-router';
import Avatar from "@mui/material/Avatar";
import Title from "./Title";
import {Radio, RadioGroup, Zoom} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const mdTheme = createTheme();

function DashboardContent() {
    const location = useLocation();
    const serial = location.state.serial_number;

    const [data, setData] = React.useState({
        name: "string",
        isManager: location.state.chk,
        ids: ["string"],
        names: ["string"],
        tels: ["string"],
        lastMessage: "string",
        lastTime: "string",
        lastEmotion: "string",
        statistics: {
            depressed: 10,
            notDepressed: 4
        }
    });

    const [user, setUser] = React.useState("Invalid");

    useEffect(() => {
        setData({
            name: '허진우',
            isManager: true,
            ids: ["조상연", "장민혁", "황교민", "Invalid"],
            names: ["조상연", "장민혁", "황교민", "Invalid"],
            tels: ["010-1234-5678", "010-9875-6545", "010-4548-4548", "Invalid"],
            lastMessage: "집에 가고 싶다",
            lastTime: "2022-05-13",
            lastEmotion: "depressed",
            statistics: {
                depressed: 10,
                notDepressed: 4,
            }
        });
    }, [])

    // useEffect(async () => {
    //     const data = {
    //         serial: location.state.serial
    //     }
    //     console.log("서버에 정보 요청")
    //     console.log(data);
    //     await axios.post("https://aid-kookmin.herokuapp.com/info", data)
    //         .then(response => {
    //             const data = response.data;
    //             console.log(data);
    //             setData(data);
    //         });
    // }, []);

    const handleSelect = (e) => {
        setUser(e.currentTarget.value);
    }

    const renderViaType = () => {
        if (data.isManager) {
            return (
                <Box>
                    <Title>사용자 선택</Title>
                    <RadioGroup onChange={handleSelect}>
                        {data.names.map((name, idx) => (
                            <FormControlLabel
                                key={`userRadio${idx}`}
                                value={name}
                                label={name}
                                control={<Radio/>}/>))
                        }
                    </RadioGroup>
                </Box>
            )
        }
        return (
            <Grid container alignItems={'baseline'} spacing={2}>
                <Grid item xs={12}>
                    <Title>{data.name} 님의 보호자</Title>
                </Grid>
                {data.names.map((name, idx) => (
                    <Grid item xs={12} sm={6} key={`userGrid${idx}`}>
                        <Typography variant={'h6'}>{name}</Typography>
                        <Typography>{data.tels[idx]}</Typography>
                    </Grid>
                ))}
            </Grid>
        );
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
                        <Grid container spacing={3}>
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
                                    />
                                    <Typography
                                        variant={'h4'}
                                        p={2}
                                        fontWeight={'bold'}
                                    >환영합니다 {data.name}님!</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 260
                                    }}>
                                    {renderViaType()}
                                </Paper>
                            </Grid>
                            {/* Chart */}
                            {/* Recent Emotions */}
                            <Zoom in={user !== "Invalid"}>
                                <Grid item xs={12} md={6}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: 260
                                        }}
                                    >
                                        <Emotion
                                            user={user}
                                            depressed={data.statistics.depressed}
                                            notDepressed={data.statistics.notDepressed}
                                        />
                                    </Paper>
                                </Grid>
                            </Zoom>
                            {/* Recent Talk */}
                            <Grid item xs={12}>
                                <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                                    <Orders/>
                                </Paper>
                            </Grid>
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