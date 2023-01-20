import { createTheme, IconButton } from "@mui/material";
import { lime, grey } from "@mui/material/colors";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const CreateTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        ...lime,
        ...(mode === "dark"
          ? {
            main: lime[300],
          }
          : {
            main: lime[500],
          }),
      },
      secondary: {
        ...lime,
        ...(mode === "dark"
          ? {
            main: grey[300],
          }
          : {
            main: grey[900],
          }),
      },
      ...(mode === "dark" && {
        background: {
          default: grey[900],
          paper: grey[900],
        },
      }),
      text: {
        ...(mode === "light"
          ? {
            primary: grey[900],
            secondary: grey[800],
          }
          : {
            primary: "#fff",
            secondary: grey[500],
          }),
      },
    },
  });

function SwitchTheme({ onThemeChange, currentMode }: { onThemeChange: Function, currentMode: 'light' | 'dark' }) {
  return (<IconButton sx={{ ml: 1 }} onClick={() => onThemeChange()} color="inherit">
    {currentMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
  </IconButton>)
}

export { CreateTheme, SwitchTheme };