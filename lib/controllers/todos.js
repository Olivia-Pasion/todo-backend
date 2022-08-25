const { Router } = require('express');
const Todo = require('../models/Todo');
//const UserService = require('../services/UserService');


module.exports = Router()
  .get('/', async (req, res, next) => {
    try {
      const todos = await Todo.getAll(req.user.id);
      const ids = todos.map((todo) => ({
        id: todo.id,
        description: todo.description,
        done: todo.done
        
      })) 
    }
  })

