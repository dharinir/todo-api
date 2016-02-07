var express = require('express');
var app = express();

var PORT = process.env.PORT || 3000;

var todos = [ {
	id: 1,
	description: 'Meet for lunch',
	completed: false
}, {
	id: 2,
	description: 'Go to market',
	completed: false
},
{
	id:3,
	description:'Go for walk',
	completed: true
}];

app.get('/', function (req,res) {
	res.send('ToDo API root');
});


app.get('/todos/:id', function (req,res) {
	
	var toDoID = parseInt(req.params.id,10);
	var matchedToDo;
	todos.forEach(function(todo) {
		if(toDoID === todo.id) {
			matchedToDo = todo;
		}
	});
	if(matchedToDo) {
		console.log('Found match');
		res.json(matchedToDo);
	}
	else {
		res.status(404).send();
	}



});

app.get('/todos', function(req,res) {
	res.json(todos);
});




app.listen(PORT,function() {
	console.log('Express listening on port'| PORT);
})