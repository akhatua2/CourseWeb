import React from 'react'
import { NavLink } from 'react-router-dom'


const SignedInLinks = () => {
    return (
        <ul classname='right'>
            <li><NavLink to='/dashboard'>Main Page</NavLink></li>
        </ul>
    )
}

export default SignedInLinks