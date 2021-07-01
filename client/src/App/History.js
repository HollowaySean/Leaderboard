import React, { useRef, useState, useEffect } from 'react';
import '../Styles/panel.css';
import { LineChart, XAxis, YAxis, Tooltip, Line, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

let history = [];
let series = null;

export default function History(props) {

    // Set up react hooks
    const messageRef = useRef();

    // Get deck history
    retrieveMatchHistory();

    // Set up decklist
    let deckList = eval(props.deckList);

    // Function to turn audit info into data series
    function auditToSeries(audit) {
        
        // Determine object axes
        let newMatchNum = audit.sort((a, b) => (a.matchNum < b.matchNum) ? 1 : -1)[0].matchNum;
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
            idList.map((element) => {
                let found = audit.findIndex(el => (el.deckID === element && el.matchNum === i));
                if(found === -1) {
                    matchRecord[element] = history[i-1][element];
                } else {
                    matchRecord[element] = audit[found].newRating*100;
                }
            });
            history.push(matchRecord);
        }

        // Generate JSX of line series
        series = (idList.map((element, index) => {
            if(deckList === undefined) { deckList = [] }
            let newName = deckList.length === 0 ? '' : deckList.find((el) => el.deckID === element).deckName;
            console.log(newName);
            return (
            <Line 
                name={newName}
                type="linear" 
                dataKey={element} 
                yAxisId={0} 
                key={element}
                legendType="line"
            />
        )}));
    }

    // Function to get latest match number
    function findLastMatchNum(audit) {
        let newMatchNum = audit.sort((a, b) => (a.matchNum < b.matchNum) ? 1 : -1)[0].matchNum;
        props.matchNumCallback(newMatchNum);
    }


    function retrieveMatchHistory() {

        // Fetch request
        fetch(props.API_ROUTE + '/groups/audit?groupID=' + props.groupID)
        .then((res) => {
    
            // Handle HTTP status codes
            switch(res.status) {
            case 200:
                res.json()
                .then((body) => {
                    findLastMatchNum(body);
                    auditToSeries(body);
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

    // Return JSX
    return (
        <div className="panel-wide">
            <h1>Match History</h1>
            <div className="panel-body">
                <div className="panel-plot">
                    <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={history}
                                margin={{top: 20, right: 20, left: 20, bottom: 20}}
                            >
                            <CartesianGrid stroke='#f5f5f5' />
                            {series}
                            <Tooltip 
                                formatter={
                                    (value, name, props) => {
                                        return [
                                            Math.round(value),
                                            deckList.find((element) => (element.deckID === name)).deckName,
                                            props
                                        ]
                                    }
                                }
                                labelFormatter={
                                    (name) => name === 0 ? "" : "Match " + name
                                }
                                itemSorter={
                                    item => -item.value
                                }
                            />
                            <XAxis dataKey="matchNum" />
                            <YAxis scale="linear"/>
                            <Legend 
                                payload={
                                    history.map(
                                        (item, index) => ({
                                            id: item.deckName,
                                            type: "line",
                                            value: item.deckName
                                        })
                                    )
                                }
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <p ref={messageRef}></p>
            </div>
        </div>
    )
}
