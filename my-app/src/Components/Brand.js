import React from 'react'
import styled from 'styled-components'

import logo from '../assets/logo-header.png'
const Brand = () => {
  return (
    <div>
      <Image src={logo} alt='Company Logo' />
    </div>
  )
}

export default Brand

const Image = styled.img`
  height: 85%;
  margin: auto 0;
`
