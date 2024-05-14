import React, { useEffect, useState } from "react";
import API from "./API";

const AllCompanies = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await API.get('/Company');
                setData(response.data.companies);
            } catch (error) {
                console.error('Error fetching reasons:', error);
            }
        };
        fetchData();
    },[]);

    const filteredData = data.filter(company =>
        company.company_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="AllCompanies">
            <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
            />
            <table>
                <thead>
                    <tr>
                        <th>Company ID</th>
                        <th>Company Name</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((val, key) => (
                        <tr key={key} style={{ backgroundColor: key % 2 === 0 ? '#e6f7ff' : '#ffffff' }}>
                            <td>{val.company_id}</td>
                            <td>{val.company_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AllCompanies;
