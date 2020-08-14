import React from 'react'
import {text} from './classes'
import { Dropdown } from 'semantic-ui-react'

var listOfClasses = [];

function lineCount( text ) {
    var nLines = 0;
    for( var i = 0, n = text.length;  i < n;  ++i ) {
        if( text[i] === '\n' ) {
            ++nLines;
        }
    }
    return nLines;
}

const Dropdown = () => {
    var numLines = lineCount(text);
    return (
        <h1>Hello</h1>
    )
    
}