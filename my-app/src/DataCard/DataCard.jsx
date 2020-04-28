import React from 'react';
import './DataCard.css'

const person = (props) => {
    return (
        <div className="DataCard">
            <h2>{props.country}</h2>
            <p>{props.power} kw</p>
            <p>{props.date}</p>
        </div>
        )
}

export default person;
