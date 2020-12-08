import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from "react-router-dom";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { CookiesProvider } from 'react-cookie';
import { UserProvider } from './context/UserContext'
import { GlobalProvider } from './context/GlobalContext'


const themes = {
    dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
    light: `${process.env.PUBLIC_URL}/light-theme.css`,
};
ReactDOM.render(
        <BrowserRouter>
            <ThemeSwitcherProvider themeMap={themes} defaultTheme="light">
                <CookiesProvider>
                    <UserProvider>
                    <GlobalProvider>

                        <App />
                        </GlobalProvider>
                    </UserProvider>
                </CookiesProvider>
            </ThemeSwitcherProvider>
        </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
