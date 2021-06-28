import React from 'react'

export default function GroupInfo(props) {

    // TODO: DECK MANAGER
        // List
        // Add
    // TODO: LEADERBOARD
    // TODO: ADD MATCH

    if(props.groupID !== null) {
        return(
            <div>
            {props.groupID}
            </div>
        )
    }else{
        return (
            <>
            </>
        )
    }
}
