import { Fragment } from "react";
import { styled } from '@mui/material';
const { H1, H2 } = require("app/components/Typography");

function FaQ(){
    const ContentBox = styled('div')(({ theme }) => ({
        margin: '30px',
        [theme.breakpoints.down('sm')]: { margin: '16px' },
    }));


    return(
        <Fragment>
            <ContentBox classname="faq">
                <H1>Frequently Asked Questions</H1>
                <H2>Why choose Tiger Truckers?</H2>
                <p>
                    At Tiger Truckers, we want to reward truckers for their hard earned work by giving adding more value to their driving than just a paycheck.
                    It is also a way to ensure that the turckers are safely making drives throughout the country.
                </p>
                <H2>How do the points work?</H2>
                <p>
                    The points are calculated based on the Sponsor Companies own conversion from dollars to points ratio, with most companies defaulting to a $0.01/1 point calculation.
                </p>
                <H2>What is the importance of 'How was your day'?</H2>
                <p>
                    The famous mantra of Tiger Truckers stemmed from the development team always asking the scrum master how their day was. This exteneded to their care for the drivers
                    and sponsors alike, ensuring they are having a good day.
                </p>
            </ContentBox>
        </Fragment>
    );
};

export default FaQ;