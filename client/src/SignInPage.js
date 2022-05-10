import SignIn from "./components/SignIn";
import Box from "@mui/material/Box";

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
                    display:'flex',
                    backgroundColor:'white'
                }}
            >
                <SignIn/>
            </Box>
        </Box>
    )
}

export default SignInPage;