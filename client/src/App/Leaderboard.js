import React, { useRef } from 'react'

let infoList = [];
let leaderboardInfo = null;

export default function Leaderboard(props) {

    // Set ref hooks
    const messageRef = useRef([]);

    // Set up leaderboard JSX 
    infoList = eval(props.deckList);
    if(infoList === '' || infoList === undefined) {
        messageRef.current.innerHTML = 'There are no decks in this group.'
        leaderboardInfo = null;
    }else{
        messageRef.current.innerHTML = '';
        leaderboardInfo = 
            (infoList.map(element => (
                <tr key={element.deckID}>
                    <td>{element.userName}</td>
                    <td>{element.deckName}</td>
                    <td>{element.mu - 3*element.sigma}</td>
                </tr>
            )));
    }

    // Return JSX tags
    return (
        <div>
        <h1>Leaderboard:</h1>
        <table><tbody>
            <tr>
                <th>Owner</th>
                <th>Name</th>
                <th>Elo Rating</th>
            </tr>
            {leaderboardInfo}
        </tbody></table>
        <p ref={messageRef}></p>
        </div>
    )
}
