import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import * as axios from "axios";
import Button from "@mui/material/Button";
import Title from "./Title";

const AddUserPopup = ({currentId}) => {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const body = {
            userType: 'manager',
            u_id: data.get('userId'),
            u_pw: data.get('userPw'),
            serial: data.get("serial"),
            currentId: currentId,
        }
        console.log("request add user to server with");
        console.log(body);
        await axios.post("/add_user", body)
            .then(response => {
                if (response.data.registerSuccess) {
                    alert("사용자 추가에 성공하였습니다");
                } else{
                    alert("사용자 추가에 실패하였습니다. 입력된 정보를 다시 확인해주세요.");
                }
            });
    }

    return (
        <Box
            component={"form"}
            onSubmit={handleSubmit}
            noValidate
            p={12}
            display={'flex'}
            flexDirection={'column'}
        >
            <TextField
                margin="none"
                required
                id="userId"
                label="사용자 아이디"
                name="userId"
            />
            <TextField
                margin="normal"
                required
                id="userPw"
                label="사용자 비밀번호"
                name="userPw"
            />
            <TextField
                margin="normal"
                required
                id="serial"
                label="사용자 제품번호"
                name="serial"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}
                onSubmit={handleSubmit}
            >
                사용자 추가
            </Button>
        </Box>
    );
}

export default AddUserPopup;