import React, { useState } from 'react'

let title = '';

export default function Dropdown(props) {

    // State react hooks
    const [showMenu, setShowMenu] = useState(false);
    const [choice, setChoice] = useState(-1);

    // Toggle dropdown
    function toggleMenu(e) {
        setShowMenu(!showMenu);
    }

    // Handle choice
    function HandleChoice(index, e) {
        setShowMenu(false);
        setChoice(index);
        props.choiceCallback(index);
    }

    // Handle dropdown title
    if(choice === -1) {
        title = props.dropdownTitle;
    }else{
        title = props.optionList[choice];
    }

    // CSS for menu
    const menuStyle = {
        position: "absolute",
        zIndex: "100",
        display: "flex",
        flexDirection: "column",
        minWidth: "25%"
    };

    // CSS for button
    const buttonStyle = {
        borderRadius: "0%"
    }

    // CSS for header
    const headerStyle = {
        minWidth: "25%",
        borderRadius: "0%"
    }

    // Return JSX
    return (
        <div>
            <button 
                onClick={toggleMenu} 
                style={headerStyle}
            >
                {title}
            </button>

            {
                showMenu ? (
                    <div className="menu" style={menuStyle}>
                        {props.optionList.map( (element, index) =>
                            <button 
                                key={index} 
                                onClick={() => HandleChoice(index, props.myKey)}
                                style={buttonStyle}
                            >{element}</button>
                        )}
                    </div>
                ) : ( null )
            }
        </div>
    )
}
