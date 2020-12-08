import React, { useContext } from 'react'
import { Switch, Space, Avatar,Typography } from 'antd'
import logo from '../../logo.svg'
import UserContext from '../../context/UserContext';
import { Menu, Dropdown } from 'antd';
import {withRouter} from 'react-router-dom'
const {Title} = Typography
const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="/#">
        Logout
      </a>
    </Menu.Item>
  </Menu>
);


const HeaderComponent = ({ isDarkMode, toggleTheme,history }) => {
  const userContext = useContext(UserContext)

  const { user } = userContext
  console.log(user, 'sdfdlfkdfjlskjf')
  return (
    <Space style={{width: '100%', height:'5vh'}}>
      <img width={70} src={logo} alt="" href="/" />

      <Space style={{marginTop: '1rem', marginLeft: '1rem'}}>
      <Title style={{color: "white"}} level={3}>{`< Execute It />`}</Title>

        </Space> 



      <Space size='middle' style={{marginLeft: '70vw'}}>
        <Switch checkedChildren="Dark Mode On" unCheckedChildren="Dark Mode Off" checked={isDarkMode} onChange={toggleTheme} />            

        {
          history.location.pathname !== '/login'?
            <Dropdown overlay={menu}>
            <Avatar size={50} src={user.image} />
          </Dropdown>:null          
        }

      </Space>





    </Space>
  )
}

export default withRouter(HeaderComponent)