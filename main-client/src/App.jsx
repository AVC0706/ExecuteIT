import React, { useEffect, useContext ,useState } from 'react';
import { Route, Switch, } from "react-router-dom";
import { useThemeSwitcher } from "react-css-theme-switcher";
import SignIn from "./pages/sign-in/signIn.page"
import './App.less'
import {Layout} from "antd";
import { reactLocalStorage } from 'reactjs-localstorage';
import Callback from "./pages/callback/callback.page";
import WorkspacePage from "./pages/editor/workspace.page";
import RoomPage from './pages/rooms/rooms.page';
import UserContext from './context/UserContext';
import cookie from 'react-cookies'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
// import TestPage from './pages/test/test.page'
import HeaderComponent from './components/headerComponent/headerComponent.component'
import JoinPage from './pages/join/join.page'

const { Header, Content } = Layout;
const App = (props) => {
    const [loading, setLoading] = useState(true);


    const userContext = useContext(UserContext)

    // eslint-disable-next-line
    useEffect(async () => {
        const dark = await reactLocalStorage.get('theme', 'dark') === 'dark';
        await checkCookie()
        setIsDarkMode(dark)
        await switcher({ theme: dark ? themes.dark : themes.light });
    // eslint-disable-next-line
    }, [])

    const checkCookie = async () => {
        const token = await cookie.load('jwt')

        if (props.history.location.pathname === '/login')
            return

        if (token) {
            //verify token
            axios.get(`${process.env.REACT_APP_MAIN_SERVER}/auth/verify`, {
                headers: {
                    'x-api-key': token
                }
            })
                .then((res) => {
                    //if successfull then store user details in global state
                    console.log(res.data)
                    userContext.setUser(res.data)
                    if (props.history.location.pathname === '/')
                        props.history.push('/rooms')
                })
                .then(()=>{
                    setLoading(false)
                })
                .catch(() => {
                    props.history.push('/login')
                })
        } else {
            props.history.push('/login')
        }
    }

    const { switcher, status, themes } = useThemeSwitcher();

    const [isDarkMode, setIsDarkMode] = React.useState()

    const toggleTheme = (isChecked) => {
        setIsDarkMode(isChecked);
        reactLocalStorage.set('theme', isChecked ? 'dark' : 'light')
        switcher({ theme: isChecked ? themes.dark : themes.light });
        window.location.reload()
    };

    // Avoid theme change flicker
    if (status === "loading") {
        return null;
    }



    return (
        <>
        
            <Layout className="layout">
                
                <Header>
                    <HeaderComponent isDarkMode={isDarkMode} toggleTheme={toggleTheme}/>
                </Header>
                <Content>
                    <Switch>
                    <Route exact path='/login'>
                            <SignIn />
                    </Route>
                    <Route exact path='/callback'>
                            <Callback />
                    </Route>
                        {
            loading?<div></div>:
                            <>
                            
                        <Route exact path='/rooms'>
                            <RoomPage />
                        </Route>
                        {/* <Route exact path='/test'>
                            <TestPage />
                        </Route>                         */}
                        <Route exact path='/workspace'>
                            <WorkspacePage />
                        </Route>
                        <Route exact path='/join'>
                            <JoinPage/>
                        </Route>

                    </>
}
                    </Switch>
                </Content>
            </Layout>
           </>              
    )
}
                    
export default withRouter(App)