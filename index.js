const express = require("express");
const fs = require("fs");
const app = express();
const cors  = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { error } = require("console");
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

function findIndex(arr, id) {
    for (let i = 0; i < arr.length; i++){
        if(arr[i].id === id) return i;
    }
    return -1;
}

function removeAtIndex(arr, index){
    let newArray = [];
    for(let i = 0; i < arr.length; i++){
        if(i !== index) newArray.push(arr[i]);
    }
    return newArray;
}
app.get('/todos', (req,res) =>{
    fs.readFile("todos.json", "utf-8", (error, data) => {
        if(error){throw error;}
        res.json(JSON.parse(data));
    })
})

app.get("/todos/:id", (req,res) => {
    fs.readFile("todos.json", "utf-8", (error, data) => {
        if (error){throw error;}
        let todos = JSON.parse(data);
        let todosIndex = findIndex(todos, parseInt(req.params.id));
        if(todosIndex === -1){
            res.status(404).send();
        }else{
            res.json(todos[todosIndex]);
        }
    })
})

app.post("/todos",  (req,res) =>{
    const newTodo = {
        id: Math.floor(Math.random() * 100000), // unique random id
        title: req.body.title,
        description: req.body.description,
    };
    fs.readFile("todos.json", "utf-8", (error,data) => {
        if(error){throw error}
        let todos = JSON.parse(data);
        todos.push(newTodo);
        fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
            if(err){throw err;}
            res.status(201).json(newTodo);
        })
    })
})

app.put("/todos/:id", (req,res) =>{
    fs.readFile("todos.json", "utf-8", (error,data)=>{
        if(error){throw error}     
        let todos = JSON.parse(data);
        let todosIndex = todos.findIndex(todos, parseInt(req.params.id));
        if(todoIndex === -1){
            res.status(404).send();
        }else{
            const updatedTodo = {
                id: todos[todosIndex].id,
                title: req.body.title,
                description: req.body.description
            };
            todos[todosIndex] = updatedTodo;
            fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
                if(err){throw err};
                res.status(200).json(updatedTodo);
            });
        }
    });
});

app.delete("/todos/:id", (req,res) =>{
    fs.readFile('todos.json', 'utf-8', (err,data)=>{
        if(err) {throw err};
        let todos = JSON.parse(data);
        let todosIndex = findIndex(todos, parseInt(req.params.id));
        if(todosIndex === -1){
            res.status(404).send();
        }else{
            todos = removeAtIndex(todos, todosIndex);
            fs.writeFile("todos.json", JSON.stringify(todos), (err)=> {
                if(err) {throw err};
                res.status(200).send()
            });
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req,res, next) => {
    res.status(404).send();
});

app.listen(PORT, () => {
    console.log("server is running on http://localhost:3000");
})