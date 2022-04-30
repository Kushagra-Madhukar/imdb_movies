import React, { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { UserContext, UserDispatchContext, UserLogoutContext } from '../user.context'

const HeaderContainer = styled.header`
    width: 100%;
    display: flex;
    flex-direction: column;
    &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        left: 0px;
        top: 64px;

        background: #E3E1E1;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
        transform: matrix(1, 0, 0, -1, 0, 0);
    }
`
const HeaderHolder = styled.div`
    display: flex;
    justify-content: space-between;
    height: 64px;
    width: 100%;
`
const HeaderMainRegion = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
`
const HeaderSecondaryRegion = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
`
const AILogo = styled.img`
    display: block;
    height: 40px;
    margin: 0;
    padding: 0;
    width: auto;
    background-color: #fff;
`
const LogoLink = styled(NavLink)`
    padding: 0;
    margin: 0;
    display: block;
    /* height: 100%; */
    width: fit-content;
`

const HeaderLink = styled(NavLink)`
    color: ${props => props.theme.fontColor};
    font-size: 0.9rem;
    font-style: normal;
    text-decoration: none;
    margin-left: 1.2em;
    padding: 0.7em;
`
const ChangeTheme = styled.button`
    display: block;
    width: 20px;
    height: 20px;
    background-color: ${props => props.theme.fontColor};
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    cursor: pointer;
`
const HeaderNotification = styled.div`
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 46px;
    width: 46px;
    border: 1px solid #f1f1f1;
    cursor: pointer;
    .noti-icon{
        font-size: 25px;
        color: ${props => props.theme.darkGray};
    }
    div{
        position: absolute;
        background-color: ${props => props.theme.parrot};
        width: 8px;
        height: 8px;
        border-radius: 50%;
        top: 22%;
        left: 60%;
        z-index: 2;
        outline: 1px solid white;
    }
`
const HeaderVertiLine = styled.div`
    width: 2px;
    height: 46px;
    background-color: #a9a9a9;
    margin: 0 20px;
`
const HeaderProfile = styled.div`
    width: 46px;
    height: 46px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    img{
        width: 100%;
        height: 100%;
    }
`
const Header = ({modifyTheme}) => {
  const userDetails = useContext(UserContext)
  const logout = useContext(UserLogoutContext)
    return (
        <HeaderContainer>
        {/* <PaddingContainer> */}
            <HeaderHolder>
                <HeaderMainRegion>
                    <LogoLink to='/'>
                        <AILogo src="https://is1-ssl.mzstatic.com/image/thumb/Purple112/v4/b1/bb/23/b1bb23b0-5941-249a-5ae6-72b07e539dfa/AppIcon-0-1x_U007emarketing-0-6-0-85-220.png/1200x630wa.png" alt="IMDB"/>
                    </LogoLink>
                    <HeaderLink to='/'>Home</HeaderLink>
                </HeaderMainRegion>
                <HeaderSecondaryRegion>
                    {/* <HeaderVertiLine/> */}
                    {!userDetails.isAdmin ? <HeaderLink to='/login'>Login</HeaderLink> : <button onClick={logout}>Logout</button>}
                </HeaderSecondaryRegion>
            </HeaderHolder>
        {/* </PaddingContainer> */}
        </HeaderContainer>
    )
}

export default Header
