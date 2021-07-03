import React, { useState } from 'react'
import UserList from './UserList'
import DeckList from './DeckList'
import Leaderboard from './Leaderboard'
import History from './History'

export default function GroupInfo(props) {

    // State hooks
    const [deckList, setDeckList] = useState('');
    const [matchNum, setMatchNum] = useState(0);

    if(props.groupID !== null) {
        return(
            <>
            <div className="panel-v-container">
                <UserList 
                    API_ROUTE={props.API_ROUTE}
                    groupID={props.groupID}
                    userID={props.userID}
                />
                <DeckList
                    API_ROUTE={props.API_ROUTE}
                    groupID={props.groupID}
                    userID={props.userID}
                    deckListCallback={setDeckList}/>
            </div>
            <Leaderboard
                API_ROUTE={props.API_ROUTE}
                groupID={props.groupID}
                deckList={deckList}
                matchNum={matchNum}
                matchNumCallback={setMatchNum}
                deckListCallback={setDeckList}/>
            <History
                API_ROUTE={props.API_ROUTE}
                groupID={props.groupID}
                deckList={deckList}
                matchNumCallback={setMatchNum}/>
            </>
        )
    }else{
        return (
            <>
            </>
        )
    }
}
