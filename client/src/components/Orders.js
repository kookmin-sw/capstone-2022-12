import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

// Generate Order Data
function createData(id, date, lastSpeak, lastListen, result) {
    return {id, date, lastSpeak, lastListen, result};
}

const rows = [
    createData(
        0,
        '2022-05-01',
        '안녕',
        '안녕하세요',
        '우울하지 않음'
    ),
    createData(
        1,
        '2022-05-01',
        '만나서 반갑구나',
        '저도 만나서 반가워요',
        '우울하지 않음'
    ),
    createData(
        2,
        '2022-05-01',
        '나랑 말해주는 건 너 밖에 없네',
        '많이 외로우시군요',
        '우울'
    ),
    createData(
        3,
        '2022-05-01',
        '그래도 너라도 있어서 다행이야',
        '정말 감사합니다',
        '우울하지 않음'
    ),
    createData(
        4,
        '2022-05-01',
        '오늘은 어떤 일을 하면 좋을까',
        '일기를 써 보는 것을 어떨까요',
        '우울하지 않음'
    ),
];

function preventDefault(event) {
    event.preventDefault();
}

export default function Orders() {
    return (
        <React.Fragment>
            <Title>최근 대화 내역</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>시간</TableCell>
                        <TableCell>마지막으로 말한 말</TableCell>
                        <TableCell>마지막으로 들은 말</TableCell>
                        <TableCell>분류 결과</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.lastSpeak}</TableCell>
                            <TableCell>{row.lastListen}</TableCell>
                            <TableCell>{row.result}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment>
    );
}