import React, { useRef, useEffect, useState } from 'react'
import AddMatch from './AddMatch';
import '../Styles/panel.css'

let infoList = [];

export default function Leaderboard(props) {

    // Set ref hooks
    const messageRef = useRef([]);

    // Set state hooks
    const [leaderboardInfo, setLeaderboardInfo] = useState(null);

    // Unpack string each time deckList is updated
    useEffect(() => {

        // Convert string to JSON
        infoList = props.deckList ? JSON.parse(props.deckList) : [];

        // Set up leaderboard JSX 
        let rating = (mu, sigma) => mu - 3*sigma;
        let sortedList = infoList.sort((a, b) => (rating(a.mu, a.sigma) > rating(b.mu, b.sigma) ? -1 : 1));
        setLeaderboardInfo
            (sortedList.map((element, index) => {
                console.log(element);
                return (
                <tr key={element.deckID}>
                    <td>{index+1}</td>
                    <td>{element.userName}</td>
                    <td>{element.deckName}</td>
                    <td>{Math.round(100 * (element.mu - 3*element.sigma))}</td>
                </tr>
                 )}
        ));

    }, [props.deckList]);

    // Set message if infoList goes to zero
    useEffect(() => {
        if(!infoList || infoList.length === 0) {
            messageRef.current.innerHTML = 'There are no decks in this group.'
            setLeaderboardInfo(null);
        }else{
            messageRef.current.innerHTML = '';
        }
    }, [setLeaderboardInfo]);

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
                    deckListCallback={props.deckListCallback}
                    API_ROUTE={props.API_ROUTE}
                    groupID={props.groupID}
                    matchNum={props.matchNum}
                    matchNumCallback={props.matchNumCallback}
                />
            </div>
        </div>
    )
}
