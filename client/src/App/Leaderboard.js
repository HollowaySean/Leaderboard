import React, { useRef, useState, useEffect } from 'react'

let infoList = [];

export default function Leaderboard(props) {

    // Set ref hooks
    const messageRef = useRef([]);

    useEffect(() => {

        infoList = eval(props.deckList);
        console.log(infoList);

    }, [props.deckList, props.groupID])

    return (
        <div>
        <h1>Leaderboard:</h1>
        <table><tbody>
            <tr>
                <th>Owner</th>
                <th>Name</th>
                <th>Elo Rating</th>
            </tr>
            {infoList
            .map(element => (
                <tr key={element.deckID}>
                    <td>{element.userName}</td>
                    <td>{element.deckName}</td>
                    <td>{element.mu - 3*element.sigma}</td>
                </tr>
            ))}
        </tbody></table>
        <p ref={messageRef}></p>
        </div>
    )
}
