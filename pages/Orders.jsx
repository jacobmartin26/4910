import { Fragment, useState, useEffect } from "react";
import { styled } from '@mui/material';
import API from "app/components/API/API";
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, FormControl, Select, MenuItem } from '@mui/material';
import useAuth from "app/hooks/useAuth";
const { H1 } = require("app/components/Typography");

const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    backgroundColor: '#fff',
}));

const OrdersTable = styled(Table)({
    minWidth: 650,
});

const StatusSelect = styled(Select)({
    minWidth: 150,
});

function Orders() {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();
    let user_role = user.role;
    let user_id = user.id;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await API.get(`/get_orders/${user_role}/${user_id}`);
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await API.post(`/update_order_status/${orderId}`, { newStatus });
            // Update the order status locally
            setOrders(prevOrders => prevOrders.map(order => {
                if (order.order_id === orderId) {
                    return { ...order, order_status: newStatus };
                }
                return order;
            }));
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 0:
                return 'Pending';
            case 1:
                return 'Accepted';
            case 2:
                return 'Rejected';
            case 3:
                return 'Canceled';
            default:
                return 'Unknown';
        }
    };

    const renderActionControl = (order) => {
        if (user_role === 1) { // Driver
            return (
                <FormControl>
                    <StatusSelect
                        value={order.order_status}
                        onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                    >
                        <MenuItem value={3}>Cancel</MenuItem>
                    </StatusSelect>
                </FormControl>
            );
        } else if (user_role === 2 || user_role === 3) { // Sponsor or Admin
            return (
                <FormControl>
                    <StatusSelect
                        value={order.order_status}
                        onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                    >
                        <MenuItem value={1}>Accept</MenuItem>
                        <MenuItem value={2}>Reject</MenuItem>
                    </StatusSelect>
                </FormControl>
            );
        } else {
            return null;
        }
    };

    return (
        <Fragment>
            <ContentBox className="orders">
                <Typography variant="h4" gutterBottom>Orders</Typography>
                <OrdersTable>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: 75 }}>Order ID</TableCell>
                            <TableCell style={{ width: 100 }}>First Name</TableCell>
                            <TableCell style={{ width: 100 }}>Last Name</TableCell>
                            <TableCell style={{ width: 200 }}>Email</TableCell>
                            <TableCell style={{ width: 100 }}>Total Cost</TableCell>
                            <TableCell style={{ width: 220 }}>Timestamp</TableCell>
                            <TableCell style={{ width: 100 }}>Order Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.order_id}>
                                <TableCell>{order.order_id}</TableCell>
                                <TableCell>{order.first_name}</TableCell>
                                <TableCell>{order.last_name}</TableCell>
                                <TableCell>{order.email}</TableCell>
                                <TableCell>{order.total_cost}</TableCell>
                                <TableCell>{order.timestamp}</TableCell>
                                <TableCell>{getStatusLabel(order.order_status)}</TableCell>
                                <TableCell>
                                    {renderActionControl(order)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </OrdersTable>
            </ContentBox>
        </Fragment>
    );
};

export default Orders;
