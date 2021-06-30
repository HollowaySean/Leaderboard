import React from 'react'
import Dropdown from './Dropdown'
import '../Styles/dropdown.css'

export default function AddMatch(props) {

    return (
        <div>
            <h4>Add Match:</h4>
            <div className="grid-container">
                <div className="grid-row">
                    <p>Decks in Match:</p>
                    <Dropdown 
                        optionList={['one', 'two', 'three']} 
                        dropdownTitle={'Choose'}
                        choiceCallback={(index) => console.log(index)}
                    />
                    <Dropdown 
                        optionList={['one', 'two', 'three']} 
                        dropdownTitle={'Choose'}
                        choiceCallback={(index) => console.log(index)}
                    />
                    <Dropdown 
                        optionList={['one', 'two', 'three']} 
                        dropdownTitle={'None'}
                        choiceCallback={(index) => console.log(index)}
                    />
                    <Dropdown 
                        optionList={['one', 'two', 'three']} 
                        dropdownTitle={'None'}
                        choiceCallback={(index) => console.log(index)}
                    />
                    <Dropdown 
                        optionList={['one', 'two', 'three']} 
                        dropdownTitle={'None'}
                        choiceCallback={(index) => console.log(index)}
                    />
                    <Dropdown 
                        optionList={['one', 'two', 'three']} 
                        dropdownTitle={'None'}
                        choiceCallback={(index) => console.log(index)}
                    />
                </div>
                <div className="grid-row">
                    <p>Winner:</p>
                    <input type="checkbox"></input>
                    <input type="checkbox"></input>
                    <input type="checkbox"></input>
                    <input type="checkbox"></input>
                    <input type="checkbox"></input>
                    <input type="checkbox"></input>
                </div> 
            </div>
        </div>
    )
}
