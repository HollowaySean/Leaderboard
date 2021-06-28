import React from 'react'
import UserList from './UserList'
import DeckList from './DeckList'
import Leaderboard from './Leaderboard'
import History from './History'

export default function GroupInfo(props) {

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
                />
            <Leaderboard
                API_ROUTE={props.API_ROUTE}
                groupID={props.groupID}/>
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
