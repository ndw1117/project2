const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');


// Handles the submission of a new project
const handleProject = async (e, onProjectAdded) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#projectTitle').value;
    const description = e.target.querySelector('#projectDescription').value;
    const file = document.getElementById('projectImage').files[0];

    if (!title || !description || !file) {
        helper.handleError('Project title, description, and image are required');
        return false;
    }

    const imageType = document.getElementById('projectImage').files[0].type;

    if (!imageType.startsWith('image/')) {
        helper.handleError('Unsupported image file type');
        return false;
    }

    const projectData = new FormData(e.target);
    projectData.append('imageType', imageType);

    helper.sendFormData(e.target.action, projectData, onProjectAdded);

    // Reset the form inputs upon success
    e.target.reset();

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
            <label htmlFor="link">Link  (optional) : </label>
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
                <img src={`data:${project.imageType};base64,${project.image}`} alt="project image" className="projectImage" />
                <h3 className="projectTitle">{project.title}</h3>
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