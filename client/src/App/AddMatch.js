import React, { useRef, useEffect, useState } from 'react'
import Dropdown from './Dropdown'
import '../Styles/dropdown.css'

let infoList = [];
let matchDecks = new Array(6).fill(null);
let matchResults = new Array(6).fill(false);

export default function AddMatch(props) {

    // Set up useref react hooks
    const messageRef = useRef();

    // Set up state hooks
    const [dropDownList, setDropDownList] = useState([]);
    const [checkBoxList, setCheckBoxList] = useState([]);

    // Unpack string each time deckList is updated
    useEffect(() => {

        // Convert string to JSOn
        infoList = props.deckList ? JSON.parse(props.deckList) : [];

        // Prepare list of dropdown menus
        let dropDownTmp = [];
        for(let i = 0; i < 6; i++) {
            let title = i < 2 ? 'Choose' : 'None';
            dropDownTmp.push(
                <Dropdown 
                    key={i}
                    optionList={infoList.map(element => element.deckName)} 
                    dropdownTitle={title}
                    choiceCallback={
                        (index) => {
                            matchDecks[i] = index;
                        }
                    }
                />)
        }
        setDropDownList(dropDownTmp);

        // Prepare list of checkboxes
        let checkBoxTmp = [];
        for(let i = 0; i < 6; i++) {
            checkBoxTmp.push(
                <input 
                    type="checkbox" 
                    key={i}
                    onChange={ () => {
                        matchResults[i] = !matchResults[i];
                    }}
                />
            );
        }
        setCheckBoxList(checkBoxTmp);

    }, [props.deckList]);

    // Callback function to handle adding a match
    function HandleAddMatch(e) {

        // Generate results object
        let results = [];
        for(let i = 0; i < 6; i++) {
            if(matchDecks[i] !== null) {
                results.push({
                    deckID: infoList[matchDecks[i]].deckID, 
                    isWinner: matchResults[i],
                    mu: infoList[matchDecks[i]].mu,
                    sigma: infoList[matchDecks[i]].sigma
                });
            }
        }

        // Check if too few decks are listed
        if(results.length < 2) {
            messageRef.current.innerHTML = 'Error: Not enough decks listed.';
            return;
        }

        // Check for duplicates
        let findDuplicates = (array) => array.filter((item, index) => array.indexOf(item) !== index);
        if(findDuplicates(results.map(element => element.deckID)).length > 0) {
            messageRef.current.innerHTML = 'Error: Duplicate deck in match.';
            return;
        }

        // Check if no winner is listed
        if(results.map(element => element.isWinner).indexOf(true) === -1) {
            messageRef.current.innerHTML = 'Error: No winner listed.';
            return;
        }

        console.log(JSON.stringify({ results: results,
            groupID: props.groupID,
            matchNum: (props.matchNum + 1)
        }));

        // POST with fetch
        fetch(props.API_ROUTE + '/groups/newmatch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ results: results,
                    groupID: props.groupID,
                    matchNum: (props.matchNum + 1)
                })
            })
            .then((res) => {
                switch(res.status) {
                    case 201:
                        res.json()
                        .then((body) => {
                            // Make updates
                            body.rows.results.forEach(element => {
                                let foundDeck = infoList.findIndex(deck => deck.deckID === element.deckID);
                                infoList[foundDeck].mu = element.mu;
                                infoList[foundDeck].sigma = element.sigma;
                            });
                            messageRef.current.innerHTML = 'Match recorded.'
                            props.matchNumCallback(props.matchNum + 1);
                            props.deckListCallback(JSON.stringify(infoList))
                        })
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
                    {checkBoxList}
                </div> 
            </div>
            <button onClick={HandleAddMatch}>Add Match</button>
            <p ref={messageRef}></p>
        </div>
    )
}
