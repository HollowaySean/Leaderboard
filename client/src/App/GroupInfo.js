import React, { useState } from 'react'
import UserList from './UserList'
import DeckList from './DeckList'
import Leaderboard from './Leaderboard'
import History from './History'

export default function GroupInfo(props) {

    // State hooks
    const [deckList, setDeckList] = useState([]);

    // Callback to update deckList for easy use
    function updateDeckList(newDeckList) {
        setDeckList(newDeckList);
    }

    if(props.groupID !== null) {
        return(
            <>
            <UserList 
                API_ROUTE={props.API_ROUTE}
                groupID={props.groupID}/>
            <DeckList
                API_ROUTE={props.API_ROUTE}
                groupID={props.groupID}
                userID={props.userID}
                deckListCallback={updateDeckList}
                />
            <Leaderboard
                API_ROUTE={props.API_ROUTE}
                groupID={props.groupID}
                deckList={deckList}/>
            <History
                API_ROUTE={props.API_ROUTE}
                groupID={props.groupID}/>
            </>
        )
    }else{
        return (
            <>
            </>
        )
    }
}
