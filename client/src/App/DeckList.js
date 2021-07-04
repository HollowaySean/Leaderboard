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

    // On initialize, groupID, or userID change, retrieve deck list
    useEffect(() => {

        // Fetch list of decks
        async function retrieveDeckList() {

            fetch(props.API_ROUTE + '/groups/decks?groupID=' + props.groupID)
            .then((res) => {
        
                // Handle HTTP status codes
                switch(res.status) {
                case 200:
                    res.json()
                    .then((body) => {
                        infoList = body.rows;
                        setIDList(body.rows.map(element => element.deckID));
                        messageRef.current.innerHTML = '';
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

        // Call function
        retrieveDeckList();

    }, [props.API_ROUTE, props.groupID, props.userID]);

    // On retrieving or changing the deck ID list, get deck names and info
    useEffect(() => {

        // Fetch deck names
        async function retrieveDeckNames() {
            fetch(props.API_ROUTE + '/decks/names?deckID=' + idList)
            .then((res) => {
        
                // Handle HTTP status codes
                switch(res.status) {
                case 200:
                    res.json()
                    .then((body) => {
                        infoList.forEach(element => {
                            let foundRow = body.rows.find(deck => deck.deckID === element.deckID);
                            element.deckName = foundRow ? foundRow.deckName : null;
                        });
                        setNameList(infoList.map(element => element.deckName));
                        retrieveDeckOwners();
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
        async function retrieveDeckOwners() {
            fetch(props.API_ROUTE + '/users/names?userID=' + infoList.map(element => element.userID))
            .then((res) => {
        
                // Handle HTTP status codes
                switch(res.status) {
                case 200:
                    res.json()
                    .then((body) => {
                        infoList.forEach(element => {
                            let foundRow = body.rows.find(user => user.userID === element.userID);
                            element.userName = foundRow ? foundRow.userName : null;
                        });
                        setOwnerList(infoList.map(element => element.userName));
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

        retrieveDeckNames();

    }, [idList, props.API_ROUTE]);

    // When ownerlist is set, pass infolist up the chain
    useEffect(() => {
        props.deckListCallback(JSON.stringify(infoList));
    }, [ownerList])

    // Set message if idList goes to zero
    useEffect(() => {

        // Set message
        if(!idList || idList.length === 0) {
            messageRef.current.innerHTML = "There are no decks in this group.";
        }
    });

    // Callback function to handle creating a new deck
    function HandleCreateDeck(e) {

        if(newDeckRef.current.value === '') { return; }

        let deckName = newDeckRef.current.value;

        fetch(props.API_ROUTE + '/decks/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              deckName : deckName,
              userID : props.userID
            })
          }).then((res) => {
    
            // Handle HTTP status codes
            switch(res.status) {
            case 201:
                res.json()
                .then((body) => {
                    
                    newDeckRef.current.value = '';
                    messageRef.current.innerHTML = 'Created new deck \'' + deckName + '\'';

                    // Add deck to group
                    addDeckToGroup(body.rows[0].deckID, deckName);
                });
                break;
            case 409:
                // Report collision error
                newDeckRef.current.innerHTML = '';
                messageRef.current.innerHTML = 'User already has deck with name \'' + deckName + '\'';
                break;
            default:
                console.log('Unknown HTTP response: ' + res.status);
            }
        })
        .catch((error) => {

            // Catch HTTP errors
            messageRef.current.innerHTML = 'Error creating deck.';
        });
    }

    // Callback function to add deck to group
    function addDeckToGroup(deckID, deckName) {
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
                    
                    // Update lists
                    setIDList(idList.concat([body.rows[0].deckID]));
                    setNameList(nameList.concat([deckName]));
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

    // Return JSX
    return (
        <div className="panel">
            <h1>Decks</h1>
            <div className="panel-body">
                <div className="panel-table">
                    <table><tbody>
                    <tr>
                        <th>Owner</th>
                        <th>Name</th>
                    </tr>
                        {infoList
                        .map(element => (
                            <tr key={element.deckID}>
                                <td>{element.userName}</td>
                                <td>{element.deckName}</td>
                            </tr>
                        ))}
                        </tbody></table>
                    </div>
                <p ref={messageRef}></p>
                <div className="labelButton">
                    <label htmlFor={newDeckRef}>Create new deck:</label>
                    <input type="text" ref={newDeckRef}></input>
                    <button onClick={HandleCreateDeck}>Create</button>
                </div>
            </div>
        </div>
    )
}
