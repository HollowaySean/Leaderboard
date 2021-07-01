import React, { useRef } from 'react';
import '../Styles/panel.css';
import { LineChart, XAxis, YAxis, Tooltip, Line, CartesianGrid, ResponsiveContainer } from 'recharts';

let history = [];
let data = [];

export default function History(props) {

    // Set up react hooks
    const messageRef = useRef();

    // Get deck history
    retrieveMatchHistory();

    // Function to turn audit info into data series
    function auditToSeries(audit) {

        console.log(audit);
        
        // Determine object axes
        let newMatchNum = audit.sort((a, b) => (a.matchNum < b.matchNum) ? 1 : -1)[0].matchNum;
        let idList = [...new Set(audit.map(element => element.deckID))];

        console.log(newMatchNum);
        console.log(idList);

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
                let found = audit.find(element => (element.deckID === element && element.matchNum === i));
                if(found === undefined) {
                    matchRecord[element] = history[i-1][element];
                } else {
                    matchRecord[element] = audit[found].newRating;
                }
            });
            history.push(matchRecord);
        }

        console.log(history);

    }

    // Function to get latest match number
    function findLastMatchNum(audit) {
        let newMatchNum = audit.sort((a, b) => (a.matchNum < b.matchNum) ? 1 : -1)[0].matchNum;
        props.matchNumCallback(newMatchNum);
    }

    // Function to query deck history from group
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

    // Dummy data for test purposes
    let data = [];
    for(let i = 0; i < 20; i++) {
        data.push({
            name: i,
            uv: i,
            pv: (i + (5*(Math.random() - 0.5)))
        })
    }

    // Return JSX
    return (
        <div className="panel-wide">
            <h1>Match History</h1>
            <div className="panel-body">
                <div className="panel-plot">
                    <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{top: 20, right: 20, left: 20, bottom: 20}}
                            >
                            <CartesianGrid stroke='#f5f5f5' />
                            <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0}/>
                            <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={0}/>
                            <Tooltip />
                            <XAxis dataKey="name" />
                            <YAxis />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <p ref={messageRef}></p>
            </div>
        </div>
    )
}
