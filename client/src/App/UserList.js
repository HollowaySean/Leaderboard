import React, { useRef, useState, useEffect } from 'react'

let infoList = [];

export default function UserList(props) {

    // Set ref hooks
    const messageRef = useRef([]);

    // Set state variables
    const [idList, setIDList] = useState(null);
    const [nameList, setNameList] = useState([]);

    // Retrieve user list via useeffect and fetch
    useEffect(() => {

        // Fetch list of users
        async function retrieveUserList() {
            fetch(props.API_ROUTE + '/groups/users?groupID=' + props.groupID)
            .then((res) => {
        
                // Handle HTTP status codes
                switch(res.status) {
                case 200:
                    res.json()
                    .then((body) => setIDList(body.userID))
                    break;
                default:
                    console.log('Unknown HTTP response: ' + res.status);
                }
            })
            .catch((error) => {

                // Catch HTTP errors
                messageRef.current.innerHTML = 'Error obtaining users in group.';
            });
        }

        // Fetch user names
        function retrieveUserNames() {
            fetch(props.API_ROUTE + '/users/names?userID=' + idList)
            .then((res) => {
        
                // Handle HTTP status codes
                switch(res.status) {
                case 200:
                    res.json()
                    .then((body) => {
                        infoList = body
                        setNameList(body.userName);
                    });
                    break;
                default:
                    console.log('Unknown HTTP response: ' + res.status);
                }
            })
            .catch((error) => {

                // Catch HTTP errors
                messageRef.current.innerHTML = 'Error obtaining user names.';
            });
        }

        // Get user list if empty, otherwise grab list of names
        if(idList === null){

            retrieveUserList()
        } else if(idList.length === 0){

            messageRef.current.innerHTML = "There are no members in this group.";
        } else {

            // Get user names in this case
            retrieveUserNames();
        }

    }, [idList, nameList, props.API_ROUTE]);

    useEffect(() => {
        messageRef.current.innerHTML = '';
        infoList = [];
        setIDList(null)
        setNameList([]);
    }, [props.groupID]);

    // Return JSX
    return (
        <div>
        <h1>Users:</h1>
        <table><tbody>
            <tr>
                <th>Name</th>
            </tr>
            {infoList
            .map(element => (
                <tr key={element.userID}>
                    <td>{element.userName}</td>
                </tr>
            ))}
        </tbody></table>
        <p ref={messageRef}></p>
        </div>
    )
}
