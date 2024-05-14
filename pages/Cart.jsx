// Import necessary dependencies
import { Fragment, useState, useEffect } from "react";
import { styled } from '@mui/material';
import useAuth from "app/hooks/useAuth";
import API from "app/components/API/API";
import { Card, CardContent, CardMedia, Typography, Button, Box, Snackbar, Select, MenuItem } from '@mui/material';
import MuiAlert from '@mui/material/Alert'; // Import Alert component

const { H1 } = require("app/components/Typography");

// Define Cart component
function Cart() {
    const { user } = useAuth();
    const id = Number(user ? user.id : null);
    const [cartData, setCartData] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [orderSubmitted, setOrderSubmitted] = useState(false); // State variable for order submission message
    const [companies, setCompanies] = useState([]); // State variable to store company objects
    const [selectedCompany, setSelectedCompany] = useState(''); // State variable to store the selected company ID
    const [companyNames, setCompanyNames] = useState([]);
    const [driverPoints, setDriverPoints] = useState(0); // State variable to store driver's points
    const [enoughPoints, setEnoughPoints] = useState(true); // State variable to check if driver has enough points

    // Define CSS styling
    const ContentBox = styled('div')(({ theme }) => ({
        margin: '30px',
        [theme.breakpoints.down('sm')]: { margin: '16px' },
    }));

    // Fetch cart data on component mount
    useEffect(() => {
        let isMounted = true; // Add a variable to track component mount state

        const fetchCartData = async () => {
            try {
                const response = await API.get(`/Cart/${id}/${selectedCompany}`);
                if (isMounted) { // Check if component is still mounted before updating state
                    setCartData(response.data.cart);

                    // Calculate total cost
                    let total = 0;
                    response.data.cart.forEach(item => {
                        total += item.prod_cost;
                    });
                    setTotalCost(total);
                }
            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
        };

        fetchCartData();

        // Cleanup function to cancel any ongoing tasks
        return () => {
            isMounted = false; // Set isMounted to false when component is unmounted
        };
    }, [user.id, selectedCompany]);

    // Fetch driver's points on component mount
    useEffect(() => {
        const fetchDriverPoints = async () => {
            try {
                const response = await API.get(`/get_driver_points/${user.id}/${selectedCompany}`);
                setDriverPoints(response.data.points);
            } catch (error) {
                console.error('Error fetching driver points:', error);
            }
        };

        fetchDriverPoints();
    }, [user.id, selectedCompany]);

    // Remove item from cart
    const removeFromCart = async (cartId) => {
        try {
            await API.delete(`/Cart/${user.id}/${cartId}/${selectedCompany}`);
            setCartData(prevCartData => prevCartData.filter(item => item.cart_id !== cartId));
            
            // Recalculate the total cost
            let total = 0;
            cartData.forEach(item => {
                if (item.cart_id !== cartId) {
                    total += item.prod_cost;
                }
            });
            setTotalCost(total);
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    // Checkout function to add order
    const checkout = async () => {
        try {
            if (driverPoints < totalCost) {
                setEnoughPoints(false); // Update state to indicate not enough points
                return;
            }

            // Prepare cart items
            const cartItems = cartData.map(item => ({
                prod_id: item.prod_id,
                prod_title: item.prod_title,
                prod_cost: item.prod_cost
            }));
            console.log("CART ITEMS:", cartItems);
            // submit order and cart items
            await API.post('/add_order', { user_id: user.id, total_cost: totalCost, cart_items: cartItems, company_id: selectedCompany });
            setOrderSubmitted(true); // Update state to show order submission message
        } catch (error) {
            console.error('Error adding order:', error);
            // Handle error
        }
    };

    // Close order submission message
    const handleClose = () => {
        setOrderSubmitted(false);
    };

    // Fetch driver's companies on component mount
    useEffect(() => {
        const fetchDriverCompanies = async () => {
            try {
                const response = await API.get(`/get_driver_companies/${user.id}`);
                const companiesData = response.data.companies.map(company => ({ id: company, name: '' }));
                setCompanies(companiesData);

                // Set the selected company to the first company in the list initially
                if (companiesData.length > 0) {
                    setSelectedCompany(companiesData[0].id);
                }
            } catch (error) {
                console.error('Error fetching driver companies:', error);
            }
        };

        fetchDriverCompanies();
    }, [user.id]);


    // Fetch company names when companies state changes
    useEffect(() => {
        const fetchCompanyNames = async () => {
            try {
                const names = await Promise.all(companies.map(company => getCompanyNameById(company.id)));
                setCompanyNames(names);
            } catch (error) {
                console.error('Error fetching company names:', error);
            }
        };

        if (companies.length > 0) {
            fetchCompanyNames();
        }
    }, [companies]);

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
    };

    // Handle company selection change
    const handleCompanyChange = (event) => {
        setSelectedCompany(event.target.value);
    };

    // Render Cart component
    return (
        <Fragment>
            <ContentBox className="cart">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">Your Cart</Typography>
                    <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" style={{ marginRight: '10px' }}>Select Company:</Typography>
                        <Select value={selectedCompany} onChange={handleCompanyChange}>
                            {companies.map((company, index) => (
                                <MenuItem key={company.id} value={company.id}>
                                    {companyNames[index]}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                    <Button variant="contained" color="primary" onClick={checkout}>Submit Order</Button>
                </Box>
                <Typography variant="subtitle1" gutterBottom>Total Cost: {totalCost} points</Typography>
                <Typography variant="subtitle1" gutterBottom>Your Points: {driverPoints}</Typography>
                {!enoughPoints && (
                    <Typography variant="subtitle1" gutterBottom style={{ color: 'red' }}>You do not have enough points for this order.</Typography>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {cartData.length > 0 ? (
                        // Display cart items if cart is not empty
                        cartData.map(item => (
                            <Card key={item.cart_id} style={{ margin: '10px', width: '40%', maxWidth: '200px', height: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <CardMedia
                                    component="img"
                                    src={item.prod_image}
                                    alt={item.prod_title}
                                    style={{ objectFit: 'cover', width: '100%' }}
                                />
                                <CardContent style={{ textAlign: 'center', flex: '1' }}>
                                    <Typography gutterBottom variant="h5" component="div" style={{ marginBottom: '10px' }}>
                                        {item.prod_title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" style={{ marginBottom: '10px' }}>
                                        Points: {item.prod_cost}
                                    </Typography>
                                    <Box display="flex" justifyContent="center">
                                        <Button variant="contained" color="error" onClick={() => removeFromCart(item.cart_id)}>Remove</Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        // Display message if cart is empty
                        <Typography variant="h6" style={{ textAlign: 'center', marginTop: '50px' }}>Your cart is empty</Typography>
                    )}
                </div>
                {/* Snackbar for order submission message */}
                <Snackbar open={orderSubmitted} autoHideDuration={6000} onClose={handleClose}>
                    <MuiAlert onClose={handleClose} severity="success">
                        Your order has been submitted successfully!
                    </MuiAlert>
                </Snackbar>
            </ContentBox>
        </Fragment>
    );
}

export default Cart; // Export Cart component
