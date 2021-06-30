import React, { useState } from 'react'
import UserList from './UserList'
import DeckList from './DeckList'
import Leaderboard from './Leaderboard'
import History from './History'

export default function GroupInfo(props) {

    // State hooks
    const [deckList, setDeckList] = useState([]);
    const [needUpdate, setNeedUpdate] = useState(false);

    // Callback to update deckList for easy use
    function updateDeckList(newDeckList) {
        setNeedUpdate(false);
        setDeckList(newDeckList);
    }

    function setDeckListCallback() {
        setNeedUpdate(true);
    }

    if(props.groupID !== null) {
        return(
            <>
            <div className="panel-v-container">
                <UserList 
                    API_ROUTE={props.API_ROUTE}
                    groupID={props.groupID}/>
                <DeckList
                    API_ROUTE={props.API_ROUTE}
                    groupID={props.groupID}
                    userID={props.userID}
                    needUpdate={needUpdate}
                    deckListCallback={updateDeckList}
                    needUpdateCallback={setNeedUpdate}/>
            </div>
            <Leaderboard
                API_ROUTE={props.API_ROUTE}
                groupID={props.groupID}
                deckList={deckList}
                updateCallback={setDeckListCallback}/>
            <History
                API_ROUTE={props.API_ROUTE}
                groupID={props.groupID}
                deckList={deckList}/>
            </>
        )
    }else{
        return (
            <>
            </>
        )
    }
}
