const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleProject = (e, onProjectAdded) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#projectTitle').value;

    // HARD-CODED USERNAME. STILL NEED TO GET CURRENT USERNAME
    const username = 'ndw';

    if (!title || !username) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { title, ownerName: username }, onProjectAdded);

    // Reset the text input box upon success
    e.target.querySelector('#projectTitle').value = '';

    return false;
};

const ProjectForm = (props) => {
    return (
        <form id="projectForm"
            onSubmit={(e) => handleProject(e, props.triggerReload)}
            name="prjectForm"
            action="/maker"
            method="POST"
            className="projectForm"
        >
            <label htmlFor="title">Title: </label>
            <input id="projectTitle" type="text" name="title" placeholder="Project Title" />
            {/* <label htmlFor="age">Age: </label> */}
            {/* <input id="domoAge" type="number" min="0" name="age" placeholder="Domo Age" /> */}
            <input className="submitProject" type="submit" value="Submit Project" />
        </form>
    );
};

const ProjectList = (props) => {
    const [projects, setProjects] = useState(props.projects);

    useEffect(() => {
        const loadProjectsFromServer = async () => {
            const response = await fetch('/getProjects');
            const data = await response.json();
            setProjects(data.projects);
        };
        loadProjectsFromServer();
    }, [props.reloadProjects]);

    if (projects.length === 0) {
        return (
            <div className="projectList">
                <h3 className="emptyProject">No Projects Yet!</h3>
            </div>
        );
    }

    const projectNodes = projects.map(project => {
        return (
            <div key={project.id} className="project">
                {/* Will need to change image from favicon to the project's image */}
                <img src="/assets/img/favicon.svg" alt="project image" className="projectImage" />
                <h3 className="projectTitle">Title: {project.title}</h3>
                {/* <h3 className="domoAge">Age: {project.age}</h3> */}
            </div>
        );
    });

    return (
        <div className="projectList">
            {projectNodes}
        </div>
    );
};

const App = () => {
    const [reloadProjects, setReloadProjects] = useState(false);

    return (
        <div id="editor">
            <div id="makeProject">
                <ProjectForm triggerReload={() => setReloadProjects(!reloadProjects)} />
            </div>
            <div id="projects">
                <ProjectList projects={[]} reloadProjects={reloadProjects} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;