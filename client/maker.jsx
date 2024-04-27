const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');


// Handles the submission of a new project
const handleProject = async (e, onProjectAdded) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#projectTitle').value;
    // const link = e.target.querySelector('#projectLink').value;
    // const description = e.target.querySelector('#projectDescription').value;

    if (!title) {
        helper.handleError('Project title is required');
        return false;
    }

    // // Uses spread syntax to conditionally add the values to the data being sent if they exist
    // const projectData = {
    //     title,
    //     ...(link && { link }),
    //     ...(description && { description })
    // };

    const projectData = new FormData(e.target);
    // for (let [name, value] of projectData.entries()) {
    //     console.log(`${name}: ${value}`);
    // }

    helper.sendFormData(e.target.action, projectData, onProjectAdded);

    // Reset the text input boxes upon success
    e.target.querySelector('#projectTitle').value = '';
    e.target.querySelector('#projectLink').value = '';
    e.target.querySelector('#projectDescription').value = '';

    return false;
};

const ProjectForm = (props) => {
    return (
        <form id="projectForm"
            onSubmit={(e) => handleProject(e, props.triggerReload)}
            name="projectForm"
            action="/maker"
            method="POST"
            className="projectForm"
        // encType="multipart/form-data"
        >
            <label htmlFor="title">Title: </label>
            <input id="projectTitle" type="text" name="title" placeholder="Project Title" />
            <label htmlFor="link">Link: </label>
            <input id="projectLink" type="text" name="link" placeholder="Project Link" />
            <label htmlFor="description">Description: </label>
            <textarea id="projectDescription" name="description" placeholder="Project Description" />
            <label htmlFor="image">Image: </label>
            <input id="projectImage" type="file" name="image" accept="image/*" />
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
                {/* Embeds the buffer data from project.image in an img tag for display*/}
                <img src={`data:image/*;base64,${project.image}`} alt="project image" className="projectImage" />
                <h3 className="projectTitle">Title: {project.title}</h3>
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