import SignIn from "./components/SignIn";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function SignInPage() {
    return (
        <Box
            sx={{
                height:'100vh',
                width:'100vw',
                alignItems: 'center',
                display: 'flex',
                justifyContent:"center",
                backgroundImage: `url(${"signinback.png"})`,
                backgroundSize: '50% 50%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition:'center'
            }}
        >
            <Box
                sx={{
                    width: '30vw',
                    height: '50vh',
                    borderRadius:12,
                    boxShadow:6,
                    alignItems: 'center',
                    justifyContent:'center',
                    display:'block',
                    backgroundColor:'white',
                    p:8
                }}
            >
                <Typography variant={'h4'} fontWeight={'bold'} color={'black'} pb={6}>AID에 오신 것을 환영합니다.</Typography>
                <SignIn/>
            </Box>
        </Box>
    )
}

export default SignInPage;