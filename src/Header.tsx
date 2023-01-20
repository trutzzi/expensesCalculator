import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Container, Link, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';


const activeClassName = 'isActive';

export default function Header({ children }: { children: any }) {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar elevation={15} position="fixed" >
                <Container maxWidth={'lg'}>
                    <Toolbar className='nav'>
                        <NavLink className={({ isActive }) => isActive ? activeClassName : undefined} to={'/'}><Typography><Link variant='h6' color={'secondary'}>Home</Link></Typography></NavLink>
                        <NavLink className={({ isActive }) => isActive ? activeClassName : undefined} to={'/filters'}><Typography><Link variant='h6' color={'secondary'}>Tags</Link></Typography></NavLink>
                        <NavLink className={({ isActive }) => isActive ? activeClassName : undefined} to={'/info'}><Typography><Link variant='h6' color={'secondary'}>Info</Link></Typography></NavLink>
                        <div style={{ justifyContent: 'space-between', display: 'flex', width: '100%' }}>
                            {children}
                        </div>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
}