import React, { useState, useRef, useEffect } from 'react'

let infoList = [];

export default function DeckList(props) {

    // Set ref hooks
    const messageRef = useRef([]);

    // Set state variables
    const [idList, setIDList] = useState(null);
    const [nameList, setNameList] = useState([]);
    const [ownerList, setOwnerList] = useState([]);

    // Retrieve user list via useeffect and fetch
    useEffect(() => {

        // Fetch list of groups
        async function retrieveDeckList() {
            fetch(props.API_ROUTE + '/groups/decks?groupID=' + props.groupID)
            .then((res) => {
        
                // Handle HTTP status codes
                switch(res.status) {
                case 200:
                    res.json()
                    .then((body) => {
                        console.log(body);
                        infoList = body;
                        setIDList(body.length > 0 ? body.deckID : []);
                    });
                    break;
                default:
                    console.log('Unknown HTTP response: ' + res.status);
                }
            })
            .catch((error) => {

                // Catch HTTP errors
                messageRef.current.innerHTML = 'Error obtaining decks in group.';
            });
        }

        // Fetch deck names
        function retrieveDeckNames() {
            fetch(props.API_ROUTE + '/decks/names?deckID=' + idList)
            .then((res) => {
        
                // Handle HTTP status codes
                switch(res.status) {
                case 200:
                    res.json()
                    .then((body) => {
                        console.log(body);
                        for(let i = 0; i < infoList.length; i++) {
                            infoList[i].deckName = body.deckName[i];
                        }
                        setNameList(body.deckName);
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
        console.log(idList);
        if(idList === null){

            retrieveDeckList()
        } else if(idList.length === 0){

            messageRef.current.innerHTML = "There are no decks in this group.";
        } else {

            // Get user names in this case
            retrieveDeckNames();
        }

    }, [idList, nameList, props.API_ROUTE]);

    useEffect(() => {
        infoList = [];
        setIDList(null)
        setNameList([]);
    }, [props.groupID]);

    // Return JSX
    return (
        <>
        <h1>Users in Group:</h1>
        <table><tbody>
            <tr>
                <th>Name</th>
            </tr>
            {infoList
            .map(element => (
                <tr key={element.deckID}>
                    {/* <td>{element.deckName}</td> */}
                </tr>
            ))}
        </tbody></table>
        <p ref={messageRef}></p>
        </>
    )
}
