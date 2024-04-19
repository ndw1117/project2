const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');


// The React component for account information
const AccountWindow = (props) => {
    const [user, setUser] = useState(props.user);

    useEffect(() => {
        const loadAccountInfo = async () => {
            const response = await fetch('/getAccount');
            const data = await response.json();
            console.log(data);
            setUser(data.user);
        };
        loadAccountInfo();
    }, [props.reloadUser]);

    return (
        <div className='mainForm centered'>
            <h3>Your Info</h3>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <button>Change Password</button>
        </div>
    );
};

const App = () => {
    const [reloadUser, setReloadUser] = useState(false);

    return (
        <div>
            <AccountWindow user={[]} reloadUser={reloadUser} />
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('content'));
    root.render(<App />);
};

window.onload = init;