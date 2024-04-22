const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handlePassChange = async (e) => {
    e.preventDefault();
    helper.hideError();

    // HARD-CODED USERNAME. STILL NEED TO GET CURRENT USERNAME
    const username = 'ndw';
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;


    if (!username || !pass || !pass2) {
        helper.handleError('Missing required fields!');
        return false;
    }

    if (pass !== pass2) {
        helper.handleError('Passwords do not match');
        return false;
    }


    const response = await helper.sendPost(e.target.action, { username, pass, pass2 });

    helper.handleSuccess(response.message);

    return false;
};

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

    const passButtonClicked = () => {
        document.getElementById('passForm').classList.remove('hidden');
        document.getElementById('passButton').classList.add('hidden');
    };

    return (
        <div className='accountDiv centered'>
            <h3>Your Info</h3>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <button id="passButton" onClick={passButtonClicked}>Change Password</button>
            <form
                id="passForm"
                name="passForm"
                onSubmit={handlePassChange}
                action="/newPass"
                method="POST"
                className="hidden"
            >
                <label htmmlFor="pass">Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password" />
                <label htmlFor="pass">Password: </label>
                <input id="pass2" type="password" name="pass2" placeholder="retype password" />
                <input className="formSubmit" type="submit" value="Submit" />
            </form>
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