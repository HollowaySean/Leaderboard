import React, { useRef, useState, useEffect } from 'react'
import '../Styles/panel.css'

// Initializations
let infoList = [];
let table = null;

export default function GroupList(props) {

    // Set ref hooks
    const messageRef = useRef([]);
    const newGroupRef = useRef([]);
    const inviteRef = useRef([]);

    // Set state variables
    const [idList, setIDList] = useState(null);
    const [nameList, setNameList] = useState([]);
    const [highlightID, setHighlightID] = useState(null);

    // On initialize or userID change, retrieve group list
    useEffect(() => {

        // Fetch list of groups
        async function retrieveGroupList() {

            fetch(props.API_ROUTE + '/users/groups?userID=' + props.userID)
            .then((res) => {
        
                // Handle HTTP status codes
                switch(res.status) {
                case 200:
                    res.json()
                    .then((body) => {
                        messageRef.current.innerHTML = '';
                        setIDList(body.rows.map(element => element.groupID))
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

        // Call function
        retrieveGroupList();

    }, [props.API_ROUTE, props.userID]);

    // On retrieving or changing the group ID list, get the group names and info
    useEffect(() => {

        // Fetch group names
        async function retrieveGroupNames() {

            fetch(props.API_ROUTE + '/groups/info?groupID=' + idList)
            .then((res) => {
        
                // Handle HTTP status codes
                switch(res.status) {
                case 200:
                    res.json()
                    .then((body) => {
                        infoList = body.rows;
                        setNameList(infoList.map(element => element.groupName));
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

        // Call function
        retrieveGroupNames();

    }, [idList, props.API_ROUTE])

    // Set message on first load
    useEffect(() => {

        // Set message
        messageRef.current.innerHTML = "Click group name to show leaderboard.";

    }, []);

    // Set message if idList goes to zero
    useEffect(() => {

        // Set message
        if(!idList || idList.length === 0){
            messageRef.current.innerHTML = "You are not a member of any groups.";
        }
    })

    // Callback function to handle creating a new group
    function HandleCreateGroup(e) {

        if(newGroupRef.current.value === '') { return; }

        fetch(props.API_ROUTE + '/groups/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              groupName: newGroupRef.current.value
            })
          }).then((res) => {
    
            // Handle HTTP status codes
            switch(res.status) {
            case 201:
                res.json()
                .then((body) => {
                    
                    newGroupRef.current.value = '';
                    messageRef.current.innerHTML = 'Created new group \'' + body.rows[0].groupName + '\'';

                    // Add self to group
                    joinGroup(body.rows[0].inviteCode);
                });
                break;
            default:
                console.log('Unknown HTTP response: ' + res.status);
            }
        })
        .catch((error) => {

            // Catch HTTP errors
            messageRef.current.innerHTML = 'Error creating group.';
        });
    }

    // Direct function to handle joining a new group
    function joinGroup(inviteCode) {

        // Check validity
        if(inviteCode.length !== 5) {
            messageRef.current.innerHTML = 'Invalid invite code'
            return;
        }
        
        // Fetch request to add user to group
        fetch(props.API_ROUTE + '/groups/adduser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              inviteCode : inviteCode,
              userID     : props.userID
            })
          }).then((res) => {
    
            // Handle HTTP status codes
            switch(res.status) {
                case 201:
                    res.json()
                    .then((body) => {

                        // Update lists
                        setIDList(idList.concat([body.rows[0].groupID]))
                        setNameList(nameList.concat([body.rows[0].groupName]))
                        props.groupIDCallback(body.rows[0].groupID);
                        setHighlightID(body.rows[0].groupID);

                        newGroupRef.current.value = '';
                        messageRef.current.innerHTML += '<br />Added user to group \'' + body.rows[0].groupName + '\'';
                    });
                    break;
                case 400:
                    messageRef.current.innerHTML = 'No group found with invite code.'
                    break;
                case 409:
                    messageRef.current.innerHTML = 'You are already in this group.';
                    break;
                default:
                    console.log('Unknown HTTP response: ' + res.status);
            }
        })
        .catch((error) => {

            // Catch HTTP errors
            messageRef.current.innerHTML = 'Error adding user to group.';
        });
    }

    // Callback function to handle joining a new group
     function HandleJoinGroup(e) {

        messageRef.current.innerHTML = '';
        joinGroup(inviteRef.current.value);
        inviteRef.current.value = '';
    }

    // Return JSX
    return (
        <div className="panel">
            <h1>Your Groups</h1>
            <div className="panel-body">
                <div className="panel-table">
                    <table><tbody>
                        <tr>
                            <th>Name</th>
                            <th>Invite Code</th>
                        </tr>
                        {infoList
                        .map((element, index) => {
                            let myName = (element.groupID === highlightID)
                                ? (<b>{element.groupName}</b>)
                                : element.groupName;
                            return (
                                <tr key={index}>
                                    <td id="clickable" onClick={() => {
                                        setHighlightID(element.groupID);
                                        props.groupIDCallback(element.groupID);
                                    }}>{myName}</td>
                                    <td>{element.inviteCode}</td>
                                </tr>
                            )})}
                    </tbody></table>
                </div>
                    <p ref={messageRef}></p>
                    <div className="labelButton">
                        <label htmlFor={newGroupRef}>Create new group:</label>
                        <input type="text" ref={newGroupRef}></input>
                        <button onClick={HandleCreateGroup}>Create</button>
                    </div>
                    <div className="labelButton">
                        <label htmlFor={inviteRef}>Join group by invite code:</label>
                        <input type="text" ref={inviteRef}></input>
                        <button onClick={HandleJoinGroup}>Join</button>
                    </div>
                    <div className="logoutButton">
                        <button 
                            className="logoutButton" 
                            onClick={props.logoutCallback}
                        >Logout</button>
                    </div>
            </div>
        </div>
    )
}
