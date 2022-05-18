import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import Box from "@mui/material/Box";

export default function Orders({lastTime, lastEmotion, lastText}) {
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
                <TableBody>
                    <TableRow>
                        <TableCell>{lastTime}</TableCell>
                        <TableCell>{lastText}</TableCell>
                        <TableCell>{lastEmotion}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Box>
    );
}