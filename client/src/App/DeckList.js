import React, { useState, useRef, useEffect } from 'react'

let infoList = [];

export default function DeckList(props) {

    // Set ref hooks
    const messageRef = useRef([]);
    const newDeckRef = useRef([]);

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
                        infoList = body;
                        setIDList(body.length > 0 ? body.map(element => element.deckID) : []);
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
                        for(let i = 0; i < infoList.length; i++) {
                            infoList[i].deckName = body[i].deckName;
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
                messageRef.current.innerHTML = 'Error obtaining deck names.';
            });
        }

        // Fetch deck owners
        function retrieveDeckOwners() {
            fetch(props.API_ROUTE + '/users/names?userID=' + infoList.map(element => element.userID))
            .then((res) => {
        
                // Handle HTTP status codes
                switch(res.status) {
                case 200:
                    res.json()
                    .then((body) => {
                        for(let i = 0; i < infoList.length; i++) {
                            infoList[i].userName = body[i].userName;
                        }
                        setOwnerList(body.userName);
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

            retrieveDeckList()
        } else if(idList.length === 0){

            messageRef.current.innerHTML = "There are no decks in this group.";
        } else {

            // Get user names in this case
            retrieveDeckNames();
            retrieveDeckOwners();
        }

    }, [idList, nameList, props.API_ROUTE]);

    // Callback for changing selected group
    useEffect(() => {
        messageRef.current.innerHTML = '';
        infoList = [];
        setIDList(null)
        setNameList([]);
        setOwnerList([]);
    }, [props.groupID]);

    // Callback funciton to handle creating a new deck
    function HandleCreateDeck(e) {

        if(newDeckRef.current.value === '') { return; }

        console.log(newDeckRef.current.value);
        console.log(props.userID);

        fetch(props.API_ROUTE + '/decks/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              deckName : newDeckRef.current.value,
              userID : props.userID
            })
          }).then((res) => {

            console.log("Made it here");
            console.log(res);
    
            // Handle HTTP status codes
            switch(res.status) {
            case 201:
                res.json()
                .then((body) => {

                    console.log("made it here");
                    
                    newDeckRef.current.value = '';
                    messageRef.current.innerHTML = 'Created new deck \'' + body.deckName + '\'';

                    // Add deck to group
                    addDeckToGroup(body.deckID);
                });
                break;
            default:
                console.log('Unknown HTTP response: ' + res.status);
            }
        })
        .catch((error) => {

            // Catch HTTP errors
            messageRef.current.innerHTML = 'Error creating deck.';
        });

        function addDeckToGroup(deckID) {
            // Fetch request to add user to group
            fetch(props.API_ROUTE + '/groups/adddeck', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                groupID : props.groupID,
                userID : props.userID,
                deckID : deckID
                })
            }).then((res) => {
        
                // Handle HTTP status codes
                switch(res.status) {
                case 201:
                    res.json()
                    .then((body) => {
                        
                        // Force refresh
                        infoList = [];
                        setIDList(null)
                        setNameList([]);
                        setOwnerList([]);

                    });
                    break;
                default:
                    console.log('Unknown HTTP response: ' + res.status);
                }
            })
            .catch((error) => {

                // Catch HTTP errors
                messageRef.current.innerHTML = 'Error adding deck to group.';
            });
        }

    }

    // Return JSX
    return (
        <>
        <h1>Decks:</h1>
        <table><tbody>
            <tr>
                <th>Owner</th>
                <th>Name</th>
            </tr>
            {infoList
            .map(element => (
                <tr key={element.deckID}>
                    <td>{element.deckName}</td>
                    <td>{element.userName}</td>
                </tr>
            ))}
        </tbody></table>
        <p ref={messageRef}></p>
        <label htmlFor={newDeckRef}>Create new deck:</label>
        <br/>
        <input type="text" ref={newDeckRef}></input>
        <button onClick={HandleCreateDeck}>Create</button>
        </>
    )
}
