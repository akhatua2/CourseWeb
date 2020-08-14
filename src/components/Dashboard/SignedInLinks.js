import React from 'react'
import GradeDist from '../GradePage'
import DropList from '../DropList'
import { NavLink } from 'react-router-dom'


const SignedInLinks = () => {
    return (
        <ul classname='right'>
            <li><NavLink to='/dashboard'>Main Page</NavLink></li>
            <li><NavLink to='/gradedist'>Grade Dist</NavLink></li>
            <li><NavLink to='/droplist'>Drop List</NavLink></li>
        </ul>
    )
}

export default SignedInLinks