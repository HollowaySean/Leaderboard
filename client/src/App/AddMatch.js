import React from 'react'
import Dropdown from './Dropdown'
import '../Styles/dropdown.css'

export default function AddMatch(props) {

    const deckStyle = {
        display: "flex",
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignIems: 'baseline'
    }

    const singleDeckStyle = {
        display: "block"
    }

    return (
        <div>
            <h4>Add Match:</h4>
            <div style={deckStyle}>
                <div>
                    <p>Decks in Match:</p>
                    <p>Winner:</p>
                </div>
                <div style={singleDeckStyle}>
                    <Dropdown 
                        optionList={['one', 'two', 'three']} 
                        dropdownTitle={'title'}
                        choiceCallback={(index) => console.log(index)}
                    />
                    <input type="checkbox"></input>
                </div>
                <div style={singleDeckStyle}>
                    <Dropdown 
                        optionList={['one', 'two', 'three']} 
                        dropdownTitle={'title'}
                        choiceCallback={(index) => console.log(index)}
                    />
                    <input type="checkbox"></input>
                </div>
                <div style={singleDeckStyle}>
                    <Dropdown 
                        optionList={['one', 'two', 'three']} 
                        dropdownTitle={'title'}
                        choiceCallback={(index) => console.log(index)}
                    />
                    <input type="checkbox"></input>
                </div>
                <div style={singleDeckStyle}>
                    <Dropdown 
                        optionList={['one', 'two', 'three']} 
                        dropdownTitle={'title'}
                        choiceCallback={(index) => console.log(index)}
                    />
                    <input type="checkbox"></input>
                </div>
                <div style={singleDeckStyle}>
                    <Dropdown 
                        optionList={['one', 'two', 'three']} 
                        dropdownTitle={'title'}
                        choiceCallback={(index) => console.log(index)}
                    />
                    <input type="checkbox"></input>
                </div>
                <div style={singleDeckStyle}>
                    <Dropdown 
                        optionList={['one', 'two', 'three']} 
                        dropdownTitle={'title'}
                        choiceCallback={(index) => console.log(index)}
                    />
                    <input type="checkbox"></input>
                </div>
            </div>
        </div>
    )
}
