import React from 'react'
import UserList from './UserList'
import DeckList from './DeckList'
import Leaderboard from './Leaderboard'
import History from './History'

let deckList = [];

export default function GroupInfo(props) {

    // Callback to update deckList for easy use
    function updateDeckList(newDeckList) {
        console.log("Updating deck list");
        deckList = newDeckList;
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
