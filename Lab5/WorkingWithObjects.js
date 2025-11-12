const assignment = {
  id: 1,
  title: 'NodeJS Assignment',
  description: 'Create a NodeJS server with ExpressJS',
  due: '2021-10-10',
  completed: false,
  score: 0,
};

const moduleData = {
  id: 'MOD-101',
  name: 'Introduction to Express',
  description: 'Implement basic REST endpoints with Express.js',
  course: 'CS5610',
};

export default function WorkingWithObjects(app) {
  const getAssignment = (req, res) => {
    res.json(assignment);
  };

  const getAssignmentTitle = (req, res) => {
    res.json(assignment.title);
  };

  const setAssignmentTitle = (req, res) => {
    const { newTitle } = req.params;
    assignment.title = newTitle;
    res.json(assignment);
  };

  const setAssignmentScore = (req, res) => {
    const { newScore } = req.params;
    const parsedScore = Number(newScore);
    if (Number.isNaN(parsedScore)) {
      res.status(400).send('Invalid score value');
      return;
    }
    assignment.score = parsedScore;
    res.json(assignment);
  };

  const setAssignmentCompleted = (req, res) => {
    const { completed } = req.params;
    assignment.completed = completed === 'true';
    res.json(assignment);
  };

  const getModule = (req, res) => {
    res.json(moduleData);
  };

  const getModuleName = (req, res) => {
    res.json(moduleData.name);
  };

  const setModuleName = (req, res) => {
    const { newName } = req.params;
    moduleData.name = newName;
    res.json(moduleData);
  };

  const setModuleDescription = (req, res) => {
    const { newDescription } = req.params;
    moduleData.description = newDescription;
    res.json(moduleData);
  };

  app.get('/lab5/assignment', getAssignment);
  app.get('/lab5/assignment/title', getAssignmentTitle);
  app.get('/lab5/assignment/title/:newTitle', setAssignmentTitle);
  app.get('/lab5/assignment/score/:newScore', setAssignmentScore);
  app.get('/lab5/assignment/completed/:completed', setAssignmentCompleted);
  app.get('/lab5/module', getModule);
  app.get('/lab5/module/name', getModuleName);
  app.get('/lab5/module/name/:newName', setModuleName);
  app.get('/lab5/module/description/:newDescription', setModuleDescription);
}
