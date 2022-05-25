import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import Box from "@mui/material/Box";

function renderItem(lastTimes, lastEmotions, lastTexts) {
    const items = lastTimes.map((item, idx) => 
        <TableRow key={`row${idx}`}>
            <TableCell key={`cell0${idx}`}>{item}</TableCell>
            <TableCell key={`cell1${idx}`}>{lastTexts[idx]}</TableCell>
            <TableCell key={`cell2${idx}`}>{lastEmotions[idx]}</TableCell>
        </TableRow>
    );
    return (
        <TableBody>{items}</TableBody>
    );
}

export default function Orders({lastTimes, lastEmotions, lastTexts}) {
    return (
        <Box>
            <Title>최근 대화 내역</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>시간</TableCell>
                        <TableCell>마지막으로 말한 말</TableCell>
                        <TableCell>분류 결과</TableCell>
                    </TableRow>
                </TableHead>
                {renderItem(lastTimes, lastEmotions, lastTexts)}
            </Table>
        </Box>
    );
}