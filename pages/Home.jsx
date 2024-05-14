import React, { Fragment, useState, useEffect } from "react";
import { styled } from '@mui/material';
import { useDispatch } from 'react-redux';
import { toggleView } from 'app/redux/actions/NavigationAction';
import useAuth from "app/hooks/useAuth";

const Container = styled('div')({
    position: 'relative',
});

const ToggleButton = styled('button')({
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: '999',
    '&:hover': {
        background: '#0056b3',
    },
});

const Message = styled('div')({
    position: 'absolute',
    top: '63px',
    right: '20px',
    color: '#007bff',
    fontSize: '14px',
    fontWeight: 'bold',
    zIndex: '999',
});

const BlogContainer = styled('div')({
    marginTop: '40px',
});

const ThoughtBubble = styled('div')({
    position: 'relative',
    //display: 'inline-block',
    padding: '20px',
    background: '#f9f9f9',
    borderRadius: '50%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '30px',
    marginLeft: '10px',
    '&::before': {
        content: '""',
        position: 'absolute',
        width: '40px',
        height: '20px',
        background: '#f9f9f9',
        bottom: '-10px',
        left: '-20px',
        borderRadius: '0 0 0 50%',
        transform: 'rotate(-45deg)',
        boxShadow: 'inherit',
    },
});

const BlogTitle = styled('h3')({
    margin: '0',
    marginBottom: '10px',
    fontSize: '24px',
    textAlign: 'center', // Center align the title
});

const BlogContent = styled('p')({
    margin: '0',
    color: '#333',
    fontSize: '16px',
    lineHeight: '1.6',
    textAlign: 'center', // Center align the content
});

const Home = () => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const [toggleCount, setToggleCount] = useState(0);

    const handleToggleView = () => {
        let newView;
        if (user.role === 3) { // Admin
            if (toggleCount === 0) newView = 2; // Switch to sponsor view
            else if (toggleCount === 1) newView = 1; // Switch to driver view
            else if (toggleCount === 2) newView = 3; // Switch back to admin view
        } else if (user.role === 2) { // Sponsor
            if (toggleCount === 0) newView = 1; // Switch to driver view
            else if (toggleCount === 1) newView = 2; // Switch back to sponsor view
            else if (toggleCount === 2) newView = 1;
        }
        // Prevent sponsor user from switching to admin view
        if (user.role === 2 && newView === 3) {
            return;
        }

        setToggleCount((toggleCount + 1) % 3); // Increment toggle count cyclically
        dispatch(toggleView(newView)); // Dispatch toggleView action with the new view
    };

    // Check if the user role is either '2' (sponsor) or '3' (admin)
    let isSponsorOrAdmin = false;
    if (user.role === 2 || user.role === 3) {
        isSponsorOrAdmin = true;
    }

    // Mock data for blog posts (replace with actual API call)
    const [blogPosts, setBlogPosts] = useState([]);
    useEffect(() => {
        const mockPosts = [
            { id: 1, title: "Review #221", content: "Love this website, so easy to use!" },
            { id: 2, title: "Review #222", content: "As a driver I can say this program has 100% improved my driving." },
            { id: 3, title: "Review #223", content: "So many great songs to browse through!" }
        ];
        setBlogPosts(mockPosts);
    }, []);

    return (
        <Fragment>
            <Container>
                {isSponsorOrAdmin && (
                    <Fragment>
                        <Message>Click to toggle view</Message>
                        <ToggleButton onClick={handleToggleView}>Toggle View</ToggleButton>
                    </Fragment>
                )}
                <div className="home-content">
                    <h1>Welcome to the Homepage</h1>
                    <BlogContainer>
                        <h2>Latest Reviews About Tiger Truckers:</h2>
                        {blogPosts.map(post => (
                            <ThoughtBubble key={post.id}>
                                <BlogTitle>{post.title}</BlogTitle>
                                <BlogContent>{post.content}</BlogContent>
                            </ThoughtBubble>
                        ))}
                    </BlogContainer>
                </div>
            </Container>
        </Fragment>
    );
};

export default Home;
