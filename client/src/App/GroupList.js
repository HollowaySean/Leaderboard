import React, { useRef, useState, useEffect } from 'react'
import '../Styles/panel.css'

let infoList = [];

export default function GroupList(props) {

    // Set ref hooks
    const messageRef = useRef([]);
    const newGroupRef = useRef([]);
    const inviteRef = useRef([]);

    // Set state variables
    const [idList, setIDList] = useState(null);
    const [nameList, setNameList] = useState([]);

    // Retrieve group list via useeffect and fetch
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
                        setIDList(body)
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

        // Fetch group names
        function retrieveGroupNames() {
            fetch(props.API_ROUTE + '/groups/info?groupID=' + idList)
            .then((res) => {
        
                // Handle HTTP status codes
                switch(res.status) {
                case 200:
                    res.json()
                    .then((body) => {
                        infoList = body;
                        setNameList(body.groupName);
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

        // Get group list if empty, otherwise grab list of names
        if(idList === null){

            retrieveGroupList()
        } else if(idList.length === 0){

            messageRef.current.innerHTML = "You are not a member of any groups.";
        } else {

            // Get group names in this case
            retrieveGroupNames();
        }

    }, [idList, props.API_ROUTE, props.userID]);

    // Callback function to handle creating a new group
    function HandleCreateGroup(e) {

        if(newGroupRef.current.value === '') {return;}

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
                    messageRef.current.innerHTML = 'Created new group \'' + body.groupName + '\'';

                    // Add self to group
                    joinGroup(body.inviteCode);
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
              inviteCode: inviteCode,
              userID : props.userID
            })
          }).then((res) => {
    
            // Handle HTTP status codes
            switch(res.status) {
            case 201:
                res.json()
                .then((body) => {
                    
                    infoList.push(body);
                    var joinedNames = [nameList, body.groupName];
                    setNameList(joinedNames);
                    newGroupRef.current.value = '';

                    messageRef.current.innerHTML += '<br />Added user to group \'' + body.groupName + '\'';
                });
                break;
            case 400:
                messageRef.current.innerHTML = 'No group found with invite code.'
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
                <table><tbody>
                    <tr>
                        <th>Name</th>
                        <th>Invite Code</th>
                    </tr>
                    {infoList
                    .map(element => (
                        <tr key={element.groupID}>
                            <td id="clickable" onClick={() => props.groupIDCallback(element.groupID)}>{element.groupName}</td>
                            <td>{element.inviteCode}</td>
                        </tr>
                    ))}
                </tbody></table>
                <form>
                    <div className="labelButton">
                        <label htmlFor={newGroupRef}>Create new group:</label>
                        <input type="text" ref={newGroupRef}></input>
                        <button onClick={HandleCreateGroup}>Create</button>
                    </div>
                    <div className="labelButton">
                        <label htmlFor={inviteRef}>Join group by invite code:</label>
                        <input type="text" ref={inviteRef}></input>
                        <button onClick={HandleJoinGroup}>Create</button>
                    </div>
                </form>
                <p ref={messageRef}></p>
            </div>
        </div>
    )
}
