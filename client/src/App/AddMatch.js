import React, { useRef } from 'react'
import Dropdown from './Dropdown'
import '../Styles/dropdown.css'

let deckList = [];
let matchDecks = new Array(6).fill(null);
let matchResults = new Array(6).fill(false);

export default function AddMatch(props) {

    // Set up useref react hooks
    const messageRef = useRef();

    // Read in JSON string
    if(props.deckList.length > 0) {
        deckList = JSON.parse(props.deckList);
    }

    // Prepare list of dropdown menus
    let dropDownList = [];
    for(let i = 0; i < 6; i++) {
        let title = i < 2 ? 'Choose' : 'None';
        dropDownList.push(
            <Dropdown 
                key={i}
                optionList={deckList.map(element => element.deckName)} 
                dropdownTitle={title}
                choiceCallback={
                    (index) => {
                        matchDecks[i] = index;
                    }
                }
            />)
    }

    // Prepare list of checkboxes
    let checkboxList = [];
    for(let i = 0; i < 6; i++) {
        checkboxList.push(
            <input 
                type="checkbox" 
                key={i}
                onChange={ () => {
                    matchResults[i] = !matchResults[i];
                    console.log(matchResults);
                }}
            />
        );
    }

    // Callback function to handle adding a match
    function HandleAddMatch(e) {
        let results = [];
        for(let i = 0; i < 6; i++) {
            if(matchDecks[i] !== null) {
                console.log(props.deckList);
                results.push({deckID: deckList[matchDecks[i]].deckID, isWinner: matchResults[i]});
            }
        }
        console.log(
            JSON.stringify({ results: results,
                groupID: props.groupID,
                matchNum: 0
            })
        )

        fetch(props.API_ROUTE + '/groups/newmatch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ results: results,
                    groupID: props.groupID,
                    matchNum: 0
                })
            })
            .then((res) => {
                switch(res.status) {
                    case 201:
                        
                        // Make updates
                        messageRef.current.innerHTML = 'Match recorded.'
                        props.updateCallback(true);

                        break;
                default:
                    console.log('Unknown HTTP response: ' + res.status);
                }
            })
            .catch((error) => {

                // Catch HTTP errors
                messageRef.current.innerHTML = 'Error adding match.';
            });
    }

    // Return JSX
    return (
        <div className="match-container">
            <h4>New Match:</h4>
            <div className="grid-container">
                <div className="grid-row">
                    <p>Decks in Match:</p>
                    {dropDownList}
                </div>
                <div className="grid-row">
                    <p>Winner:</p>
                    {checkboxList}
                </div> 
            </div>
            <button onClick={HandleAddMatch}>Add Match</button>
            <p ref={messageRef}></p>
        </div>
    )
}
