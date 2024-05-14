import React, { useEffect, useState } from "react";
import API from "./API";
import useAuth from "app/hooks/useAuth";
// const { H2 } = require("app/components/Typography");

const PointData = () => {
    const [pointsData, setPointsData] = useState([]);
    //const [data, setData] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await API.get(`/driver_dash_points/${user.id}`);
                setPointsData(response.data.points);
            } catch (error) {
                console.error('Error fetching reasons:', error);
            }
        };
        fetchData();
    }, [user.id]);

    return (
        <div>
            {pointsData.map((point, index) => (
                <p key={index}>{point.points} points for {point.company_name}</p>
            ))}
        </div>
    );
};

export default PointData;