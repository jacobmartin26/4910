import React, { Fragment, useState, useEffect, useCallback } from "react";
import { styled } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
//import { useDispatch } from 'react-redux'; // Import useDispatch hook
//import { addProductToCart } from 'app/redux/actions/EcommerceActions'; // Import addProductToCart action creator
// eslint-disable-next-line
import API from "app/components/API/API";
import useAuth from "app/hooks/useAuth";
import Modal from '@mui/material/Modal'; // Import Modal component

const styles = `
.results {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.result {
    flex: 0 0 calc(25% - 20px);
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    padding: 10px;
    box-sizing: border-box;
}

.result img {
    max-width: 100%;
    border-radius: 5px;
    margin: 0 auto;
    display: block;
    margin-bottom: 10px;
}

.details {
    text-align: center;
}

.trackName {
    margin-bottom: 5px;
    font-weight: bold;
}

.artistName {
    margin-bottom: 5px;
}

.price {
    margin-bottom: 5px;
}

.preview {
    width: 100%;
    margin-top: 10px;
}

.searchButton {
    margin-top: 10px;
}
`;

function Catalog(){
    const [catalogData, setCatalogData] = useState([]);
    const [filterExplicit, setFilterExplicit] = useState('no');
    const [searchQuery, setSearchQuery] = useState('');
    const [submittedQuery, setSubmittedQuery] = useState('');
    const [mediaType, setMediaType] = useState('');
    const [sortOrder, setSortOrder] = useState('none'); // Default sort order is set to "none"
    const [limit, setLimit] = useState(5); // Default limit is set to 5
    const [priceFilter, setPriceFilter] = useState('none'); // Default price filter value
    const [popularityFilter, setPopularityFilter] = useState('none'); // Default popularity filter value
    const [selectedMediaTypes, setSelectedMediaTypes] = useState([]); // Track selected media types
    const [modalOpen, setModalOpen] = useState(false); // Track modal state
    const [allowedMediaTypes, setAllowedMediaTypes] = useState([]);
    const [companyList, setCompanyList] = useState([]); // State variable to store the list of companies
    const [selectedCompany, setSelectedCompany] = useState(""); // State variable to store the selected company ID
    const [companyNames, setCompanyNames] = useState("");
    const [moneyToPointRatio, setMoneyToPointRatio] = useState(null); // State variable to store the money to point ratio
    const { user } = useAuth();
    const id = Number(user ? user.id : null);
    const isSponsor = user && user.role === 2; // Check if the user is a sponsor
    const isDriver = user && user.role === 1; // Check if the user is a driver

    const ContentBox = styled('div')(({ theme }) => ({
        margin: '30px',
        [theme.breakpoints.down('sm')]: { margin: '16px' },
    }));

    // Fetch the list of companies the driver is subscribed to
    const fetchCompanyList = useCallback(() => {
        if (isDriver) {
            API.get(`/get_driver_companies/${id}`)
                .then(response => {
                    setCompanyList(response.data.companies);
                    // Set the selected company to the first company in the list initially
                    setSelectedCompany(response.data.companies[0]);
                })
                .catch(error => console.error('Error fetching company list:', error));
        }
    }, [isDriver, id]);

    // Function to fetch company name by ID
    const getCompanyNameById = async (companyId) => {
        try {
            const response = await API.get(`/get_company_name/${companyId}`);
            if (response.data && response.data.company_name) {
                return response.data.company_name;
            } else {
                throw new Error('Company name not found');
            }
        } catch (error) {
            console.error('Error fetching company name:', error);
            return ''; // Return an empty string or handle the error as per your application's requirement
        }
    }

    // Function to fetch all company names asynchronously
    const fetchCompanyNames = async () => {
        const companyNames = [];
        for (const companyId of companyList) {
            const companyName = await getCompanyNameById(companyId);
            companyNames.push(companyName);
        }
        return companyNames;
    };

    useEffect(() => {
        fetchCompanyList();
    }, [fetchCompanyList]);

    // Function to handle company change in the dropdown
    const handleCompanyChange = (event) => {
        setSelectedCompany(event.target.value);
    };

    // Function to fetch catalog data based on selected company
    useEffect(() => {
        if (selectedCompany) {
            // Call the route to get the company's preferences
            API.get(`/get_company_preferences/${id}/${selectedCompany}`)
                .then(response => {
                    const { media_types } = response.data; // Destructure media_types from response.data
                    console.log("Media types:", media_types); // Log the media types array
                    setAllowedMediaTypes(media_types); // Set the selected media types based on the response

                    // Update mediaType state only if it's not already set to an allowed value
                    if (!media_types.includes(mediaType)) {
                        setMediaType(media_types[0]); // Set to the first allowed media type
                    }
                })
                .catch(error => console.error('Error fetching catalog data:', error));
        }
    }, [selectedCompany, id]);

    // Function to fetch money to point ratio for the selected company
    const fetchMoneyToPointRatio = useCallback(() => {
        if (selectedCompany) {
            API.get(`/get_money_to_point_ratio/${selectedCompany}`)
                .then(response => {
                    const ratio = response.data.money_to_point_ratio;
                    setMoneyToPointRatio(ratio); // Store the retrieved ratio in state
                })
                .catch(error => console.error('Error fetching money to point ratio:', error));
        }
    }, [selectedCompany]);

    useEffect(() => {
        fetchMoneyToPointRatio();
    }, [fetchMoneyToPointRatio]);

    // Fetch company names and update state when companyList changes
    useEffect(() => {
        if (companyList.length > 0) {
            fetchCompanyNames().then(names => setCompanyNames(names));
        }
    }, [companyList]);

    // Function to handle adding media types to the user's preferences
    const handleAddPreferences = () => {
        // Prevent adding duplicate media types
        const uniqueMediaTypes = Array.from(new Set(selectedMediaTypes));
        console.log(uniqueMediaTypes);
        // Call the API to add the selected media types to the preferences
        API.post(`/set_company_preferences/${id}`, { media_types: uniqueMediaTypes })
            .then(response => {
                console.log(response.data); // Log response for debugging
                // Close the modal after successfully adding preferences
                setModalOpen(false);
            })
            .catch(error => console.error('Error setting preferences:', error));
    };

    // Function to handle selecting media types
    const handleMediaTypesChange = (event) => {
        setSelectedMediaTypes(event.target.value);
    };

    // Function to handle adding a product to the cart
    const handleAddToCart = (userId, myItem) => {
        const priceInPoints = Math.ceil(myItem.trackPrice / moneyToPointRatio);
        console.log(userId);
        console.log(myItem);
        console.log(moneyToPointRatio);
        console.log("Calling add_product");
        API.post('add_product', {
            user_id: userId,
            prod_id: myItem.trackId,
            prod_title: myItem.trackName,
            prod_image: myItem.artworkUrl100,
            prod_cost: priceInPoints,
            company_id: selectedCompany
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                // API call was successful, proceed with dispatch
                console.log("API call successful");
                console.log("Finished cart stuff");
            } else {
                // API call failed, handle error
                console.log("Item already exists in your cart.");
                console.error("API call failed with status:", response.status);
            }
        })
        .catch(error => {
            // API call failed, handle error
            console.log("Item already exists in your cart.");
            console.error("Error:", error);
        });
    };
    
    useEffect(() => {
        if (submittedQuery !== '') {
            let apiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(submittedQuery)}&explicit=${filterExplicit}&media=${mediaType}&limit=${limit}`;

            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            fetch(proxyUrl + encodeURIComponent(apiUrl))
                .then(response => response.json())
                .then(data => {
                    // Remove exact duplicates based on trackId
                    const uniqueTrackIds = new Set();
                    const uniqueData = data.results.filter(item => {
                        if (uniqueTrackIds.has(item.trackId)) {
                            return false;
                        } else {
                            uniqueTrackIds.add(item.trackId);
                            return true;
                        }
                    });

                    // Filter data based on price if a price filter is selected
                    let filteredData = uniqueData;
                    if (priceFilter === 'highToLow') {
                        filteredData = uniqueData.sort((a, b) => b.trackPrice - a.trackPrice);
                    } else if (priceFilter === 'lowToHigh') {
                        filteredData = uniqueData.sort((a, b) => a.trackPrice - b.trackPrice);
                    }

                    // Apply popularity filter
                    let sortedData = filteredData;
                    if (popularityFilter === 'leastPopular') {
                        sortedData = filteredData.reverse();
                    }

                    setCatalogData(sortedData);
                })
                .catch(error => console.error('Error fetching catalog:', error));
        }
    }, [filterExplicit, submittedQuery, mediaType, sortOrder, limit, priceFilter, popularityFilter]);

    const handleFilterChange = (event) => {
        setFilterExplicit(event.target.value);
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleMediaTypeChange = (event) => {
        setMediaType(event.target.value);
    };

    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
    };

    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value)); // Parse the value to ensure it's an integer
    };

    const handlePriceFilterChange = (event) => {
        setPriceFilter(event.target.value);
    };

    const handlePopularityFilterChange = (event) => {
        setPopularityFilter(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent form submission
        setSubmittedQuery(searchQuery);
    };

    return(
        <Fragment>
            <style>{styles}</style>
            <ContentBox className="catalog">
                <h1>iTunes Catalog</h1>
                {/* Dropdown menu to select the driver's subscribed companies */}
                {isDriver && (
                <div>
                    <label htmlFor="companySelect">Select Company:</label>
                    <Select
                        id="companySelect"
                        value={selectedCompany}
                        onChange={handleCompanyChange}
                        variant="outlined"
                        sx={{ width: 200 }}
                    >
                        {companyList.map((companyId, index) => (
                            <MenuItem key={companyId} value={companyId}>
                                {companyNames[index]}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
                )}
                {/* Button to open modal for setting preferences, only visible to sponsors */}
                {isSponsor && (
                    <Button onClick={() => setModalOpen(true)} variant="outlined" sx={{ mb: 2 }}>
                        Set Preferences
                    </Button>
                )}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="searchInput">Search:</label>
                        <input 
                            type="text" 
                            id="searchInput" 
                            value={searchQuery}
                            variant="outlined"
                            sx={{ width: 150 }} 
                            onChange={handleSearchInputChange} 
                            autoFocus // Focus the input on page load
                            autoComplete="off"
                        />
                        <Button type="submit" variant="contained" className="searchButton">Search</Button>
                    </div>
                    <div>
                        <label htmlFor="mediaType">Media Type:</label>
                        <Select
                            id="mediaType"
                            value={mediaType}
                            onChange={handleMediaTypeChange}
                            variant="outlined"
                            sx={{ width: 150 }}
                        >
                            {allowedMediaTypes.map(mediaType => (
                                <MenuItem key={mediaType} value={mediaType}>{mediaType}</MenuItem>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <label htmlFor="explicitFilter">Filter Explicit:</label>
                        <Select
                            id="explicitFilter"
                            value={filterExplicit}
                            onChange={handleFilterChange}
                            variant="outlined"
                            sx={{ width: 75 }}
                        >
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                        </Select>
                    </div>
                    <div>
                        <label htmlFor="sortOrder">Sort Order:</label>
                        <Select
                            id="sortOrder"
                            value={sortOrder}
                            onChange={handleSortOrderChange}
                            variant="outlined"
                            sx={{ width: 100 }}
                        >
                            <MenuItem value="none">None</MenuItem>
                            <MenuItem value="asc">A-Z</MenuItem>
                            <MenuItem value="desc">Z-A</MenuItem>
                        </Select>
                    </div>
                    <div>
                        <label htmlFor="limitFilter">Number of Results:</label>
                        <Select
                            id="limitFilter"
                            value={limit}
                            onChange={handleLimitChange}
                            variant="outlined"
                            sx={{ width: 75 }}
                        >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                        </Select>
                    </div>
                    <div>
                        <label htmlFor="priceFilter"> Price Filter:</label>
                        <Select
                            id="priceFilter"
                            value={priceFilter}
                            onChange={handlePriceFilterChange}
                            variant="outlined"
                            sx={{ width: 100 }}
                        >
                            <MenuItem value="none">None</MenuItem>
                            <MenuItem value="highToLow">High to Low</MenuItem>
                            <MenuItem value="lowToHigh">Low to High</MenuItem>
                        </Select>
                    </div>
                    <div>
                        <label htmlFor="popularityFilter">Popularity Filter:</label>
                        <Select
                            id="popularityFilter"
                            value={popularityFilter}
                            onChange={handlePopularityFilterChange}
                            variant="outlined"
                            sx={{ width: 150 }}
                        >
                            <MenuItem value="none">None</MenuItem>
                            <MenuItem value="mostPopular">Most Popular</MenuItem>
                            <MenuItem value="leastPopular">Least Popular</MenuItem>
                        </Select>
                    </div>
                </form>
            <div className="results">
                {catalogData.filter(item => item.trackName).map((item, index) => (
                    <div className="result" key={item.trackId || index}>
                        {item.artworkUrl100 && (
                            <img className="artwork" src={item.artworkUrl100} alt={item.trackName} />
                        )}
                        <div className="details">
                            <p className="trackName">{item.trackName}</p>
                            <p className="artistName">By: {item.artistName}</p>
                            {item.trackPrice && (
                                <p className="price">Points: {item.trackPrice / moneyToPointRatio}</p>
                            )}
                            {item.previewUrl && (
                                <audio className="preview" controls>
                                    <source src={item.previewUrl} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                            {/* Button to add product to cart */}
                            <Button
                                variant="contained"
                                onClick={() => {
                                    console.log("Track ID:", item.trackId); // Log the product ID to the console
                                    handleAddToCart(id, item); // Pass appropriate details
                                }}
                            >
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            </ContentBox>
            {/* Modal for selecting media types */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <div className="modal" style={{ marginTop: '-50vh', backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
                    <h2 id="modal-title" style={{ color: 'black' }}>Select Media Types</h2>
                    <Select
                        id="mediaTypeSelect"
                        multiple
                        value={selectedMediaTypes}
                        onChange={handleMediaTypesChange}
                        sx={{ width: 200 }}
                    >
                        <MenuItem value="movie">Movie</MenuItem>
                        <MenuItem value="podcast">Podcast</MenuItem>
                        <MenuItem value="music">Music</MenuItem>
                        <MenuItem value="musicVideo">Music Video</MenuItem>
                        <MenuItem value="audiobook">Audiobook</MenuItem>
                        <MenuItem value="shortFilm">Short Film</MenuItem>
                        <MenuItem value="tvShow">TV Show</MenuItem>
                        <MenuItem value="ebook">eBook</MenuItem>
                    </Select>
                    <Button onClick={handleAddPreferences} variant="contained" sx={{ mt: 0 }}>
                        Save Preferences
                    </Button>
                </div>
            </Modal>
        </Fragment>
    );
};

export default Catalog;