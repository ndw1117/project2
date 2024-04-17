const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if (!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass });
    return false;
};

const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const email = e.target.querySelector('#email').value;
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

    // If no email was entered, it will later be gracefully received as an empty string
    helper.sendPost(e.target.action, { username, email, pass, pass2 });

    return false;
}

// The React component for login (it's functional & stateless)
const LoginWindow = (props) => {
    return (
        <div id="loginWindow">
            <form id="loginForm"
                name="loginForm"
                onSubmit={handleLogin}
                action="/login"
                method="POST"
                className="mainForm"
            >
                <label htmlFor="username">Username: </label>
                <input id="user" type="text" name="username" placeholder="username" />
                <label htmlFor="pass">Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password" />
                <input className="formSubmit" type="submit" value="Sign in" />
            </form>
        </div>
    );
};

// The component for the signup window
const SignupWindow = (props) => {
    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username"><span class="required">*</span>Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="email">Email: </label>
            <input id="email" type="email" name="email" placeholder="email" />
            <label htmmlFor="pass"><span class="required">*</span>Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass"><span class="required">*</span>Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input className="formSubmit" type="submit" value="Sign up" />
        </form>
    );
};

const init = () => {
    const switchLabel = document.getElementById('switchLabel');
    const switchButton = document.getElementById('switchButton');

    // Creates a React Root out of the content section
    const root = createRoot(document.getElementById('content'));

    switchButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (switchButton.dataset.mode === 'signup') {
            root.render(<SignupWindow />);

            switchLabel.innerText = "Already have an account? ";

            switchButton.innerText = 'Log in here';
            switchButton.dataset.mode = 'login';
            switchButton.href = '/login';

            return false;
        }

        root.render(<LoginWindow />);

        switchLabel.innerText = "Don't have an account? ";

        switchButton.innerText = 'Sign up here';
        switchButton.dataset.mode = 'signup';
        switchButton.href = '/signup';

        return false;
    });

    root.render(<LoginWindow />);

};

window.onload = init;