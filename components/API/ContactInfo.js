import React, { useEffect, useState } from "react";
import API from "./API";
import useAuth from "app/hooks/useAuth";
// const { H2 } = require("app/components/Typography");

const ContactInfo = () => {
    const [data, setData] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await API.get('Driver/' + user.id);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching reasons:', error);
            }
        };
        fetchData();
    }, [user.id]);

    return (
        <div>
            <p>{data[2]} points!</p>
        </div>
    );
};

export default ContactInfo;