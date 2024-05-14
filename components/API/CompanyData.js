import React from "react";
import API from "./API";
const { H4 } = require("app/components/Typography");

const CompanyData = ({ onCompanySelect }) => {
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        API.get('Company')
            .then(res => {
                const data = res.data;
                // Adding a selected property to each company object
                const newData = data.companies.map(company => ({
                    ...company,
                    selected: false
                }));
                setData(newData);
            })
            .catch(error => {
                console.error('Error fetching company data:', error);
            });
    }, []);

     const handleRadioChange = (companyId) => {
         // Call the callback function with the selected company ID
         setData(prevData => {
            return prevData.map(company => {
                if (company.company_id === companyId) {
                    return { ...company, selected: true };
                } else {
                    return { ...company, selected: false };
                }
            });
        });
         onCompanySelect(companyId);
     };

    return (
        <div>
            <H4>Companies</H4>
            <ul>
                {data.map(company => (
                    <li key={company.company_id}>
                        <input
                            type="radio"
                            name="company"
                            value={company.company_id}
                            checked={company.selected}
                            onChange={() => handleRadioChange(company.company_id)}
                        />
                        <label>{company.company_name}</label><br />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CompanyData;
