import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';

export const mainListItems = (
    <React.Fragment>
        <ListItemButton>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="요약" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <AccessTimeIcon />
            </ListItemIcon>
            <ListItemText primary="최근 대화 결과" />
        </ListItemButton>
    </React.Fragment>
);

export const secondaryListItems = (
    <React.Fragment>
        <ListSubheader component="div" inset>
            회원 설정
        </ListSubheader>
        <ListItemButton>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="회원정보 수정" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="로그아웃" />
        </ListItemButton>
    </React.Fragment>
);