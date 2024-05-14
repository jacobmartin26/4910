import { Fragment, useEffect, useState } from "react";
import { styled } from '@mui/material';
import API from "app/components/API/API";
import useAuth from 'app/hooks/useAuth';

const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

const ListContainer = styled('div')(({ theme }) => ({
    marginTop: '20px',
}));

const ListItem = styled('li')(({ theme }) => ({
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', // Divide list item into 5 equal columns
    gap: '10px', // Add gap between columns
}));

const PropertyHeader = styled('span')(({ theme }) => ({
    fontWeight: 'bold',
}));

const Heading = styled('h1')(({ theme }) => ({
    color: '#333',
    marginBottom: '10px',
    borderBottom: '1px solid #ccc',
    paddingBottom: '5px',
}));

const Button = styled('button')(({ theme }) => ({
    padding: '8px 12px',
    marginRight: '10px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: '#45a049',
    },
}));

const CheckboxLabel = styled('label')(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    marginRight: '20px',
    color: '#333',
    fontWeight: 'bold',
}));

const CheckboxInput = styled('input')(({ theme }) => ({
    marginRight: '5px',
}));

const SearchInput = styled('input')(({ theme }) => ({
    marginRight: '10px',
    padding: '8px 12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
}));

function AuditLog() {
    const [auditData, setAuditData] = useState({ new_users: [], logons: [], bad_logins: [], app_stat: [], point_changes: [], pass_changes: [] });
    const [showNewUsers, setShowNewUsers] = useState(false);
    const [showLogons, setShowLogons] = useState(false);
    const [showBadLogins, setShowBadLogins] = useState(false);
    const [showAppStat, setShowAppStat] = useState(false);
    const [showPointChanges, setShowPointChanges] = useState(false);
    const [showPassChanges, setShowPassChanges] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isBadLoginsExpanded, setIsBadLoginsExpanded] = useState(false); // New state variable
    const { user } = useAuth();
    let user_role = user.role;
    let user_id = user.id;

    // Handle checkbox click to expand/collapse "Failed Logins" section
    const handleToggleBadLogins = () => {
        setIsBadLoginsExpanded(!isBadLoginsExpanded); // Toggle the state
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                //let user_role = user.role;
                //let user_id = user.id;
                const response = await API.get(`/audit_log/${user_role}/${user_id}`);
                console.log(response.data.bad_logins);
                setAuditData(response.data);
            } catch (error) {
                console.error('Error fetching audit log data:', error);
            }
        };
    
        fetchData(); // Call fetchData function when component mounts
    }, []);

    const handleShowAll = () => {
        setShowNewUsers(true);
        setShowLogons(true);
        setShowBadLogins(true);
        setShowAppStat(true);
        setShowPointChanges(true);
        setShowPassChanges(true);
        setShowAll(true);
    };

    const handleHideAll = () => {
        setShowNewUsers(false);
        setShowLogons(false);
        setShowBadLogins(false);
        setShowAppStat(false);
        setShowPointChanges(false);
        setShowPassChanges(false);
        setShowAll(false);
    };

    const handleCheckAll = () => {
        setShowAll(false);
    };

    const handleSearch = (data) => {
        if (searchQuery === '') return data;
        const searchTerm = searchQuery.toLowerCase();
        return data.filter(item =>
            Object.values(item).some(value => 
                typeof value === 'string' && value.toLowerCase().includes(searchTerm)
            )
        );
    };

    return (
        <Fragment>
            <ContentBox className="auditLog">
                <div>
                    <Button onClick={handleShowAll}>View All</Button>
                    <Button onClick={handleHideAll}>Hide All</Button>
                    <SearchInput 
                        type="text" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        placeholder="Search..."
                    />
                </div>
                <ListContainer>
                    <CheckboxLabel>
                        <CheckboxInput
                            type="checkbox"
                            checked={showNewUsers || showAll}
                            onChange={() => {
                                setShowNewUsers(!showNewUsers);
                                handleCheckAll();
                            }}
                        />
                        New Users
                    </CheckboxLabel>
                    {showNewUsers && (
                        <div>
                            <Heading>New Users</Heading>
                            <ul>
                                {handleSearch(auditData.new_users).map(newUser => (
                                    <ListItem key={newUser.audit_id}>
                                        <div>
                                            <PropertyHeader>User ID:</PropertyHeader> {newUser.user_id}
                                        </div>
                                        <div>
                                            <PropertyHeader>Event Description:</PropertyHeader> {newUser.event_description}
                                        </div>
                                    </ListItem>
                                ))}
                            </ul>
                        </div>
                    )}
                </ListContainer>
                <ListContainer>
                    <CheckboxLabel>
                        <CheckboxInput
                            type="checkbox"
                            checked={showLogons || showAll}
                            onChange={() => {
                                setShowLogons(!showLogons);
                                handleCheckAll();
                            }}
                        />
                        Logons
                    </CheckboxLabel>
                    {showLogons && (
                        <div>
                            <Heading>Logons</Heading>
                            <ul>
                                {handleSearch(auditData.logons).map(logon => (
                                    <ListItem key={logon.logon_id}>
                                        <div>
                                            <PropertyHeader>User ID:</PropertyHeader> {logon.user_id}
                                        </div>
                                        <div>
                                            <PropertyHeader>Timestamp:</PropertyHeader> {logon.stamp}
                                        </div>
                                    </ListItem>
                                ))}
                            </ul>
                        </div>
                    )}
                </ListContainer>
                {!showBadLogins && user_role !== 2 && (
                    <ListContainer>
                    <CheckboxLabel>
                        <CheckboxInput
                            type="checkbox"
                            checked={isBadLoginsExpanded}
                            onChange={handleToggleBadLogins}
                        />
                        Failed Logins
                    </CheckboxLabel>
                    {isBadLoginsExpanded && (
                        <div>
                            <Heading>Failed Logins</Heading>
                            <ul>
                                {handleSearch(auditData.bad_logins).map(badLogin => (
                                    <ListItem key={badLogin.login_id}>
                                        <div>
                                            <PropertyHeader>Event Description:</PropertyHeader> {badLogin.event_description}
                                        </div>
                                        <div>
                                            <PropertyHeader>Timestamp:</PropertyHeader> {badLogin.stamp}
                                        </div>
                                    </ListItem>
                                ))}
                            </ul>
                        </div>
                    )}
                </ListContainer>
                )}
                <ListContainer>
                    <CheckboxLabel>
                        <CheckboxInput
                            type="checkbox"
                            checked={showAppStat || showAll}
                            onChange={() => {
                                setShowAppStat(!showAppStat);
                                handleCheckAll();
                            }}
                        />
                        Application Status
                    </CheckboxLabel>
                    {showAppStat && (
                        <div>
                            <Heading>Application Status</Heading>
                            <ul>
                                {handleSearch(auditData.app_stat).map(appStat => (
                                    <ListItem key={appStat.appstat_id}>
                                        <div>
                                            <PropertyHeader>Sponsor ID:</PropertyHeader> {appStat.sponsor}
                                        </div>
                                        <div>
                                            <PropertyHeader>Driver ID:</PropertyHeader> {appStat.driver}
                                        </div>
                                        <div>
                                            <PropertyHeader>Timestamp:</PropertyHeader> {appStat.date}
                                        </div>
                                        <div>
                                            <PropertyHeader>Reason:</PropertyHeader> {appStat.reason}
                                        </div>
                                    </ListItem>
                                ))}
                            </ul>
                        </div>
                    )}
                </ListContainer>
                <ListContainer>
                    <CheckboxLabel>
                        <CheckboxInput
                            type="checkbox"
                            checked={showPointChanges || showAll}
                            onChange={() => {
                                setShowPointChanges(!showPointChanges);
                                handleCheckAll();
                            }}
                        />
                        Point Changes
                    </CheckboxLabel>
                    {showPointChanges && (
                        <div>
                            <Heading>Point Changes</Heading>
                            <ul>
                                {handleSearch(auditData.point_changes).map(pointChange => (
                                    <ListItem key={pointChange.point_id}>
                                        <div>
                                            <PropertyHeader>Sponsor ID:</PropertyHeader> {pointChange.driver_id}
                                        </div>
                                        <div>
                                            <PropertyHeader>Driver ID:</PropertyHeader> {pointChange.sponsor_id}
                                        </div>
                                        <div>
                                            <PropertyHeader>Timestamp:</PropertyHeader> {pointChange.pointTime}
                                        </div>
                                        <div>
                                            <PropertyHeader>Actions:</PropertyHeader> {pointChange.actions}
                                        </div>
                                        <div>
                                            <PropertyHeader>Num Points:</PropertyHeader> {pointChange.numPoints}
                                        </div>
                                    </ListItem>
                                ))}
                            </ul>
                        </div>
                    )}
                </ListContainer>
                <ListContainer>
                    <CheckboxLabel>
                        <CheckboxInput
                            type="checkbox"
                            checked={showPassChanges || showAll}
                            onChange={() => {
                                setShowPassChanges(!showPassChanges);
                                handleCheckAll();
                            }}
                        />
                        Password Changes
                    </CheckboxLabel>
                    {showPassChanges && (
                        <div>
                            <Heading>Password Changes</Heading>
                            <ul>
                                {handleSearch(auditData.pass_changes).map(passChange => (
                                    <ListItem key={passChange.passchange_id}>
                                        <div>
                                            <PropertyHeader>User ID:</PropertyHeader> {passChange.user_id}
                                        </div>
                                        <div>
                                            <PropertyHeader>Type Change:</PropertyHeader> {passChange.type_change}
                                        </div>
                                        <div>
                                            <PropertyHeader>Timestamp:</PropertyHeader> {passChange.stamp}
                                        </div>
                                    </ListItem>
                                ))}
                            </ul>
                        </div>
                    )}
                </ListContainer>
            </ContentBox>
        </Fragment>
    );
}

export default AuditLog;
