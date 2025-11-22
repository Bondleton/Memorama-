import React from 'react';

export default function Button(props) {
    return (
        <button 
            className='button' 
            onClick={props.action}
            disabled={props.disabled}
        >
            {props.label}
        </button>
    );
}