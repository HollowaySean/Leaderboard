import React from 'react';
import '../Styles/panel.css';
import { LineChart, XAxis, YAxis, Line, CartesianGrid } from 'recharts';

export default function History() {

    // Function to turn audit info into data series
    // function auditToSeries() {

    // }

    // Return JSX
    return (
        <div className="panel-wide">
            <h1>Match History</h1>
            <div className="panel-body">
                <div className="panel-plot">
                    <LineChart
                        width={400}
                        height={400}
                        data={[{ name: 1, uv : 1, pv: 2}, { name: 2, uv: 2, pv: 1}]}
                        margin={{top: 5, right: 20, left: 10, bottom: 5}}
                    >
                        <CartesianGrid stroke='#f5f5f5' />
                        <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0}/>
                        <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1}/>
                        <XAxis dataKey="name" />
                        {/* <YAxis yAxisId="test"/> */}
                    </LineChart>
                </div>
            </div>
        </div>
    )
}
