import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Container } from '@mui/material';

export default function Header({ children }: { children: any }) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar elevation={15} position="fixed" >
                <Container maxWidth={'lg'}>
                    <Toolbar>
                        {children}
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
}