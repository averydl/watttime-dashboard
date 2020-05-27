import React, {Component} from 'react';
import styled from 'styled-components'
import { useSpring, animated, config } from 'react-spring'

import Brand from './Brand'
import WattMenu from './Menu'
import CollapseMenu from './CollapseMenu'
// import '../App.css'

const Navbar = (props) => {
  const barAnimation = useSpring({
    from: { transform: 'translate3d(0, -10rem, 0)' },
    transform: 'translate3d(0, 0, 0)',
  })

  const linkAnimation = useSpring({
    from: { transform: 'translate3d(0, 30px, 0)', opacity: 0 },
    to: { transform: 'translate3d(0, 0, 0)', opacity: 1 },
    delay: 800,
    config: config.wobbly,
  })

  return (
    <>
      <NavBar style={barAnimation}>
        <FlexContainer>
          <Brand />
          <Title>WattTime</Title>
          <NavLinks style={linkAnimation}>
            <a href='/'>Home</a>
            <a href='/'>About</a>
            <a href='/'>Top</a>
            <a href='/'>Test2</a>
          </NavLinks>
          <WattWrapper>
            <WattMenu
              navbarState={props.navbarState}
              handleNavbar={props.handleNavbar}
            />
          </WattWrapper>
        </FlexContainer>
      </NavBar>
      <CollapseMenu
        navbarState={props.navbarState}
        handleNavbar={props.handleNavbar}
      />
    </>
  )
}

export default Navbar

const Title = styled.div`
  color: #f2f2f2;
  font-weight: 1000;
  font-size: 2.5rem;
  margin: auto 0;
  margin-right: auto;
  padding-left: 20px;
`

const NavBar = styled(animated.nav)`
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  background: #2d3436;
  z-index: 1;
  font-size: 1.4rem;
`

const FlexContainer = styled.div`
  display: flex;
  margin: auto;
  padding: 0 2rem;
  justify-content: space-between;
  height: 5rem;
`

const NavLinks = styled(animated.ul)`
  justify-self: end;
  list-style-type: none;
  margin: auto 0;

  & a {
    font-size: 20px;
    color: #dfe6e9;
    font-weight: 600;
    border-bottom: 1px solid transparent;
    margin: 0 1.5rem;
    transition: all 300ms linear 0s;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      color: #ffe700;
      border-bottom: 1px solid #ffe700;
    }

    @media (max-width: 768px) {
      display: none;
    }
  }
`

const WattWrapper = styled.div`
  margin: auto 0;

  @media (min-width: 769px) {
    display: none;
  }
`
