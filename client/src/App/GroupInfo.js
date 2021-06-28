import React from 'react'
import UserList from './UserList'
import DeckList from './DeckList'
import Leaderboard from './Leaderboard'
import History from './History'

export default function GroupInfo(props) {

    // TODO: USER LIST
    // TODO: DECK LIST
    // TODO: LEADERBOARD
    // TODO: ADD MATCH

    if(props.groupID !== null) {
        return(
            <>
            <UserList />
            <DeckList />
            <Leaderboard />
            <History />
            </>
        )
    }else{
        return (
            <>
            </>
        )
    }
}
