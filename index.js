const express = require('express');

const app = express();
app.use(express.json());

const projects = [];

function logRequests(req, res, next) {
	console.count("Número de requisições.");

	return next();
};

function checkProjectExists(req, res, next) {
	const { id } = req.params;

	const project = projects.find(project => project.id == id);

	if (!project)
		return res.status(400).json({ error: "projeto não cadastrado!" })

	return next();
};
app.use(logRequests)

app.get('/projects', (req, res) => {
	return res.json(projects);
});

app.post('/projects', (req, res)  => {
	const { id, title } = req.body;

	projects.push({ id: id, title: title, tasks:[] });

	return res.json(projects);
});

app.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
	const { id } = req.params;
	const { title } = req.body;

	const projectIndex = projects.findIndex(project => project.id == id);

	projects[projectIndex].tasks.push(title);

	return res.json(projects);
});

app.put('/projects/:id', checkProjectExists, (req, res) => {
	const { id } = req.params;
	const { title } = req.body;

	const project = projects.find(project => project.id == id);

	project.title = title;

	return res.json(project);
});

app.delete('/projects/:id', checkProjectExists, (req, res) => {
	const { id } = req.params;

	const projectIndex = projects.findIndex(project => project.id == id);

	projects.splice(projectIndex, 1);

	return res.json(projects);
})

app.listen(3000);