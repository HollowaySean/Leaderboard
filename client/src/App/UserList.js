import React, { useRef, useState, useEffect } from 'react'
import '../Styles/panel.css'

let infoList = [];

export default function UserList(props) {

    // Set ref hooks
    const messageRef = useRef([]);

    // Set state variables
    const [idList, setIDList] = useState(null);
    const [nameList, setNameList] = useState([]);

    // On initialize or groupID change, retrieve user list
    useEffect(() => {

        // Fetch list of users
        async function retrieveUserList() {
            fetch(props.API_ROUTE + '/groups/users?groupID=' + props.groupID)
            .then((res) => {
        
                // Handle HTTP status codes
                switch(res.status) {
                case 200:
                    res.json()
                    .then((body) => {
                        setIDList(body.rows.map(element => element.userID));
                    });
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

        // Call function
        retrieveUserList();

    }, [props.API_ROUTE, props.userID, props.groupID]);

    // On retrieving or changing group ID list, get user names 

    useEffect(() => {

        // Fetch user names
        function retrieveUserNames() {

            fetch(props.API_ROUTE + '/users/names?userID=' + idList)
            .then((res) => {
        
                // Handle HTTP status codes
                switch(res.status) {
                case 200:
                    res.json()
                    .then((body) => {
                        infoList = body.rows;
                        setNameList(infoList.map(element => element.userName));
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

        // Call function
        retrieveUserNames();

    }, [idList, props.API_ROUTE]);
    


    // Return JSX
    return (
        <div className="panel">
            <h1>Users</h1>
            <div className="panel-body">
                <div className="panel-table">
                    <table><tbody>
                        <tr>
                            <th>Name</th>
                        </tr>
                        {infoList
                        .map(element =>{
                            let myName = (element.userID === props.userID) 
                                ? (<b>{element.userName}</b>)
                                : element.userName;
                            return (
                            <tr key={element.userID}>
                                <td>{myName}</td>
                            </tr>
                        )})}
                    </tbody></table>
                </div>
                <p ref={messageRef}></p>
            </div>
        </div>
    )
}
