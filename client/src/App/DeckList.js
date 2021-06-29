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
        function retrieveDeckList() {
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
                            infoList[i].userName = body.find(item => { return item.userID === infoList[i].userID}).userName;
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

        // Async function to update other parts
        async function updateDeckNameAndOwners() {
            retrieveDeckNames();
            retrieveDeckOwners();
        }

        // Get user list if empty, otherwise grab list of names
        if(idList === null){

            retrieveDeckList()
        } else if(idList.length === 0){

            messageRef.current.innerHTML = "There are no decks in this group.";
        } else {

            // Get user names in this case
            updateDeckNameAndOwners()
            .then(() => props.deckListCallback(JSON.stringify(infoList)));
        }

    }, [idList, nameList, ownerList, props.API_ROUTE]);

    // Function to reset states
    function resetStates() {
        messageRef.current.innerHTML = '';
        infoList = [];
        setIDList(null)
        setNameList([]);
        setOwnerList([]);
    }

    // Callback for changing selected group
    useEffect(() => {
        resetStates();
        props.deckListCallback('');
    }, [props.groupID]);

    // Callback function to handle creating a new deck
    function HandleCreateDeck(e) {

        if(newDeckRef.current.value === '') { return; }

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
    
            // Handle HTTP status codes
            switch(res.status) {
            case 201:
                res.json()
                .then((body) => {
                    
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

        // Callback function to add deck to group
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

                console.log("here");
        
                // Handle HTTP status codes
                switch(res.status) {
                case 201:
                    res.json()
                    .then((body) => {
                        
                        // Force refresh
                        resetStates();
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
