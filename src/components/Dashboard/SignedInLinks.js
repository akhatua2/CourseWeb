import React from 'react'
import { NavLink } from 'react-router-dom'

const SignedInLinks = () => {
    return (
        <ul classname='right'>
            <li><NavLink to='/'>Upload Homework</NavLink></li>
            <li><NavLink to='/'>Grades</NavLink></li>
            <li><NavLink to='/'></NavLink></li>
        </ul>
    )
}

export default SignedInLinks