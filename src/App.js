import { ThemeProvider } from '@material-ui/core/styles';
import AppBar from './components/app-bar';
import Main from './components/main';
import theme from './components/theme';

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <AppBar />
        <Main />
      </ThemeProvider>
    </div>
  );
}

export default App;
