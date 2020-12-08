import React, { Component } from 'react'

const UserContext = React.createContext()

class UserProvider extends Component {
    // Context state
    state = {
        user: {},
        domain: null,
        projectData: null
    }

    // Method to update state
    setUser = (user) => {
        this.setState({ user })
    }

    setDomain = (domain) => {
        this.setState({ domain })
    }

    setProjectData = (projectData) => {
        this.setState({ projectData })
    }

    render() {
        const { children } = this.props
        const { user, domain, projectData } = this.state
        const { setUser, setDomain, setProjectData } = this

        return (< UserContext.Provider value={
            {
                user,
                domain,
                projectData,
                setUser,
                setDomain,
                setProjectData
            }
        } > {children} </UserContext.Provider>)
        }
    }

    export default UserContext

    export { UserProvider}