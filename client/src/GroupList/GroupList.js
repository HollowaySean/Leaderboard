import React, { useRef, useState, useEffect } from 'react'


export default function GroupList(props) {

    // Set ref hooks
    const messageRef = useRef([]);

    // Set state variables
    const [groupList, setGroupList] = useState(null);
    const [groupNames, setGroupnames] = useState(null);

    // Fetch list of groups
    async function retrieveGroupList() {
        fetch(props.API_ROUTE + '/users/groups?userID=' + props.userID)
        .then((res) => {
    
            // Handle HTTP status codes
            switch(res.status) {
            case 200:
                res.json()
                .then((body) => setGroupList(body.groupID));
                break;
            default:
                console.log('Unknown HTTP response: ' + res.status);
            }
        })
        .catch((error) => {

            // Catch HTTP errors
            messageRef.current.innerHTML = 'Error obtaining user groups.';
        });
    }

    // Fetch group names
    function retrieveGroupNames() {
        fetch(props.API_ROUTE + '/groups/name?groupID=' + groupList)
        .then((res) => {
    
            // Handle HTTP status codes
            switch(res.status) {
            case 200:
                res.json()
                .then((body) => {
                    setGroupList(body.groupID);
                });
                break;
            default:
                console.log('Unknown HTTP response: ' + res.status);
            }
        })
        .catch((error) => {

            // Catch HTTP errors
            messageRef.current.innerHTML = 'Error obtaining user groups.';
        });
    }

    // Retrieve group list via fetch
    useEffect(() => {

        // Get group list if empty, otherwise grab list of names
        if(groupList === null){

            retrieveGroupList()
        } else if(groupList.length === 0){

            messageRef.current.innerHTML = "You are not a member of any groups.";
        } else {

            // Get group names in this case
            retrieveGroupNames();
        }

     }, [groupList]);

    // Return JSX
    return (
        <>
        <h1>Your Groups:</h1>
        {groupNames}
        <p ref={messageRef}></p>
        </>
    )
}
