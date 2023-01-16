import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Container, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';


const activeClassName = 'isActive';

export default function Header({ children }: { children: any }) {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar elevation={15} position="fixed" >
                <Container maxWidth={'lg'}>
                    <Toolbar className='nav'>
                        <NavLink className={({ isActive }) => isActive ? activeClassName : undefined} to={'/'}><Typography>Home</Typography></NavLink>
                        <NavLink className={({ isActive }) => isActive ? activeClassName : undefined} to={'/filters'}><Typography>Tags</Typography></NavLink>
                        <NavLink className={({ isActive }) => isActive ? activeClassName : undefined} to={'/info'}><Typography>Info</Typography></NavLink>
                        {children}
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
}