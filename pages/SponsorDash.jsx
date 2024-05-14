import { Fragment, useState, useContext } from "react";
import { styled } from '@mui/material';
import AuthContext from 'app/contexts/JWTAuthContext';
import SponsorDashs from "app/components/API/SponsorDash";
import PointConversion from "app/components/API/PointConversion";
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
const { H2 } = require("app/components/Typography");

function SponsorDash(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const id = Number(user ? user.id : null);

    const ContentBox = styled('div')(({ theme }) => ({
        margin: '30px',
        [theme.breakpoints.down('sm')]: { margin: '16px' },
    }));

    const handleFormSubmit = () => {
        setLoading(true);
        try {
          navigate('/pages/NewSponUser');
          setLoading(false);
        } catch (e) {
          console.log(e);
          setLoading(false);
        }
      };

    return(
        <Fragment>
            <ContentBox classname="sponsorDash">
                <SponsorDashs/>
                <br/>
                <PointConversion/>
                <div>
                <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      onClick={handleFormSubmit}
                      sx={{ mb: 2, mt: 3 }}
                    >
                      Create New User
                </LoadingButton>
            </div>

            <div>
              <H2>
                Contact Admin
              </H2>
              <p>
                Admin Email: tigertruckers@gmail.com
              </p>
              <p>
                Admin Phone: (864) 878-2537
              </p>
            </div>
            </ContentBox>
        </Fragment>
    );
};

export default SponsorDash;