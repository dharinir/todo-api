var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;


var todos = [];
var todoNextId = 1;
app.use(bodyParser.json());

app.get('/', function (req,res) {
	res.send('ToDo API root');
});


app.get('/todos/:id', function (req,res) {
	
	var toDoID = parseInt(req.params.id,10);
	var matchedToDo = _.findWhere(todos,{id: toDoID});
	if(matchedToDo) {
		res.json(matchedToDo);
	}
	else {
		res.status(404).send();
	}

});

app.get('/todos', function(req,res) {
	var queryParams = req.query;
	var filteredTodos = todos;

	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(todos, {"completed":true});
	}
	else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
		filteredTodos = _.where(todos, {"completed":false});
	}

	if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos,function(todo) {
			return todo.description.indexOf(queryParams.q) > -1;
		});
	}
	
	res.json(filteredTodos);
});

//POST /todos
app.post('/todos', function(req, res) {
	
	var body = _.pick(req.body, 'description', 'completed');
	if(!_.isBoolean(body.completed) || !_.isString(body.description) ||
		body.description.trim().length === 0) {
		return res.status(400).send();
	}
	body.description = body.description.trim();
	body.id = todoNextId;
	todoNextId++;
	todos.push(body);


	res.json(body);
});

//DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var toDoID = parseInt(req.params.id,10);
	var matchedToDo = _.findWhere(todos,{id: toDoID});
	if(matchedToDo) {
		todos = _.without(todos,matchedToDo);
		res.json(matchedToDo);
	}
	else {
		res.status(404).json({"error":"no todo found with that id"});
	}

});

//PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	var validAttr = {};
	var toDoID = parseInt(req.params.id,10);
	var matchedToDo = _.findWhere(todos,{id: toDoID});
	

	if(!matchedToDo) {
		return res.status(404).send();	
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttr.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	} else {
		//never provided attribute
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim() >0) {
		validAttr.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	} 
	_.extend(matchedToDo,validAttr);
	res.json(matchedToDo);



});

app.listen(PORT,function() {
	console.log('Express listening on port'| PORT);
})