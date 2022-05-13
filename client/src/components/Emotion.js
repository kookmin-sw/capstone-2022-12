import * as React from 'react';
import Title from './Title';
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend} from "recharts";

function preventDefault(event) {
    event.preventDefault();
}

export default function Emotion(props) {
    const user_info = props.userInfo;
    console.log("차트에 들어온 데이터")
    console.log(props);
    

    const data = [
        {
            "name": "우울",
            "value": user_info.depressed,
        },
        {
            "name": "우울하지 않음",
            "value": user_info.not_depressed,
        }
    ]

    const colors = [
        "#e57373", "#42a5f5"
    ]

    const RADIAN = Math.PI / 180;


    const renderCustomizedLabel = ({
                                       cx, cy, midAngle, innerRadius, outerRadius, percent, index,
                                   }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    }


    return (
        <React.Fragment>
            <Title>최근 2주간 감정 상태</Title>
            <ResponsiveContainer>
                <PieChart width={730} height={250}>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={50}
                        label={renderCustomizedLabel}
                        labelLine={false}
                    >
                        {
                            data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index]}/>
                            ))
                        }
                    </Pie>
                    <Legend/>
                    <Tooltip/>
                </PieChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}