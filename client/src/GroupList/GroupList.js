import React, { useRef, useState, useEffect } from 'react'

let infoList = [];

export default function GroupList(props) {

    // Set ref hooks
    const messageRef = useRef([]);
    const newGroupRef = useRef([]);

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
                    .then((body) => setIDList(body.groupID));
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
                        console.log(body.groupName);
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

     function HandleCreateGroup(e) {

        console.log("FINISH THIS AT SOME POINT");
     }

    // Return JSX
    return (
        <>
        <h1>Your Groups:</h1>
        <table><tbody>
            <tr>
                <th>Name</th>
                <th>Invite Code</th>
            </tr>
            {infoList
            .map(element => (
                <tr key={element.groupID}>
                    <td>{element.groupName}</td>
                    <td>{element.inviteCode}</td>
                </tr>
            ))}
        </tbody></table>
        <p ref={messageRef}></p>
        <label htmlFor="newGroupName">Create new group:</label>
        <br/>
        <input type="text" ref={newGroupRef}></input>
        <button onClick={HandleCreateGroup}>Create</button>
        </>
    )
}
