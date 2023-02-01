import { createTheme, IconButton } from "@mui/material";
import { lime, grey } from "@mui/material/colors";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
};
const CreateTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: lime[500]
      },
      secondary: {
        main: mode === "dark" ? grey[300] : grey[900],
      },
      text: {
        primary: mode === "light" ? grey[900] : grey[300],
        secondary: mode === "light" ? grey[800] : grey[500]
      },
    },
  });

function SwitchTheme({ onThemeChange, currentMode }: { onThemeChange: Function, currentMode: 'light' | 'dark' }) {
  return (<IconButton sx={{ ml: 1 }} onClick={() => onThemeChange()} color="inherit">
    {currentMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
  </IconButton>)
}

export { CreateTheme, SwitchTheme };