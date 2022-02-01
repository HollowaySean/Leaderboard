import React, { useRef, useEffect, useState } from 'react';
import '../Styles/panel.css';
import { LineChart, XAxis, YAxis, Tooltip, Line, CartesianGrid, ResponsiveContainer } from 'recharts';

let infoList = [];
let history = [];

let colorList = [
    '#0072BD', '#D95319', '#EDB120', '#7E2F8E', '#77AC30', '#4DBEEE', '#A2142F'
]

export default function History(props) {

    // Set up react hooks
    const messageRef = useRef();

    // Set state hooks
    const [lines, setLines] = useState(null);
    const [yLimit, setYLimit] = useState([0, 0]);

    // Unpack string each time deckList is updated
    useEffect(() => {

        // Convert string to JSON
        infoList = props.deckList ? JSON.parse(props.deckList) : [];
        
        // Set message if empty
        if(infoList.length === 0) {
            messageRef.current.innerHTML = 'There are no decks in this group.'
        }else{
            messageRef.current.innerHTML = '';
        }
        
    }, [props.deckList]);

    // On initialize or groupID change, retrieve match history
    useEffect(() => {

        // Fetch match history
        async function retrieveMatchHistory() {

            // Fetch request
            fetch(props.API_ROUTE + '/groups/audit?groupID=' + props.groupID)
            .then((res) => {
        
                // Handle HTTP status codes
                switch(res.status) {
                case 200:
                    res.json()
                    .then((body) => {
                        findLastMatchNum(body.rows);
                        auditToSeries(body.rows);
                        messageRef.current.innerHTML = '';
                    });
                    break;
                default:
                    console.log('Unknown HTTP response: ' + res.status);
                }
            })
            .catch((error) => {

                // Catch HTTP errors
                messageRef.current.innerHTML = 'Error obtaining user groups.';
            });
        }

        // Function to get latest match number
        function findLastMatchNum(audit) {
            if(audit.length > 0) {
                let newMatchNum = audit === undefined ? 0 : audit.sort((a, b) => (a.matchNum < b.matchNum) ? 1 : -1)[0].matchNum;
                props.matchNumCallback(newMatchNum);
            } else {
                props.matchNumCallback(0);
            }
        }

        // Call function
        retrieveMatchHistory();
        
    }, [props.groupID, props.API_ROUTE, props.deckList]);

    // Function to turn audit info into data series
    function auditToSeries(audit) {
        
        // Determine object axes
        let newMatchNum = 0;
        if(audit.length > 0) {
            newMatchNum = audit.sort((a, b) => (a.matchNum < b.matchNum) ? 1 : -1)[0].matchNum;
        }
        let idList = [...new Set(audit.map(element => element.deckID))];

        // Generate initial data
        let initialRecord = { matchNum : 0 };
        idList.forEach(element => {
            initialRecord[element] = 0;
        });
        history = [initialRecord];

        // Loop through and generate data series
        for(let i = 1; i <= newMatchNum; i++) {

            let matchRecord = { matchNum : i };
            idList.forEach((element) => {
                let found = audit.findIndex(el => (el.deckID === element && el.matchNum === i));
                if(found === -1) {
                    matchRecord[element] = history[i-1][element];
                } else {
                    matchRecord[element] = audit[found].newRating;
                }
            });
            history.push(matchRecord);
        }

        // Generate data limits
        let sortedScores = audit.sort((a, b) => (a.newRating < b.newRating) ? 1 : -1);
        if(sortedScores.length > 0) {
	    setYLimit([sortedScores[sortedScores.length-1].newRating, sortedScores[0].newRating]);
	}

        // Generate JSX of line series
        setLines(idList.map((element, index) => {
            let newName = infoList.length === 0 ? '' : infoList.find((el) => el.deckID === element).deckName;
            return (
            <Line 
                name={newName}
                type="linear" 
                dataKey={element} 
                yAxisId={0} 
                key={element}
                legendType="line"
                stroke={colorList[index % colorList.length]}
            />
        )}));
    }

    // Return JSX
    return (
        <div className="panel-wide">
            <h1>Match History</h1>
            <div className="panel-body">
                <div className="panel-plot">
                <div className="plot-label">Elo Rating</ div>
                    <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={history}
                                margin={{top: 20, right: 20, left: 20, bottom: 20}}
                            >
                            <CartesianGrid stroke='#f5f5f5' />
                            {lines}
                            <Tooltip 
                                labelFormatter={
                                    (name) => name === 0 ? "" : "Match " + name
                                }
                                itemSorter={
                                    item => -item.value
                                }
                            />
                            <XAxis 
                                dataKey="matchNum" 
                            />
                            <YAxis 
                                type="number"
                                domain={yLimit}
                                scale="linear"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="plot-label">Match Number</ div>
                <p ref={messageRef}></p>
            </div>
        </div>
    )
}
