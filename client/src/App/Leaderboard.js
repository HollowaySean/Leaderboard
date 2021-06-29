import React, { useRef } from 'react'
import AddMatch from './AddMatch';
import '../Styles/panel.css'

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
        let rating = (mu, sigma) => mu - 3*sigma;
        let sortedList = infoList.sort((a, b) => (rating(a.mu, a.sigma) > rating(b.mu, b.sigma) ? -1 : 1));
        leaderboardInfo = 
            (sortedList.map((element, index) => (
                <tr key={element.deckID}>
                    <td>{index+1}</td>
                    <td>{element.userName}</td>
                    <td>{element.deckName}</td>
                    <td>{Math.round(100 * (element.mu - 3*element.sigma))}</td>
                </tr>
            )));
    }

    // Return JSX tags
    return (
        <div className="panel" id="double">
            <h1>Leaderboard</h1>
            <div className="panel-body">
                <table><tbody>
                    <tr>
                        <th>Rank</th>
                        <th>Owner</th>
                        <th>Name</th>
                        <th>Elo Rating</th>
                    </tr>
                    {leaderboardInfo}
                </tbody></table>
                <p ref={messageRef}></p>
                <AddMatch 
                    deckList={props.deckList}
                />
            </div>
        </div>
    )
}
