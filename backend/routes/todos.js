const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const Todo = require('../models/Todo');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

router.get(
  '/',
  [
    query('completed').optional().isBoolean().toBoolean(),
    query('priority').optional().isIn(['low', 'medium', 'high']),
    query('sortBy').optional().isString(),
    query('order').optional().isIn(['asc', 'desc'])
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { completed, priority, sortBy = 'createdAt', order = 'desc' } = req.query;
      
      const filter = {};
      if (completed !== undefined) {
        filter.completed = completed;
      }
      if (priority) {
        filter.priority = priority;
      }

      const sortOrder = order === 'desc' ? -1 : 1;
      const sortOptions = { [sortBy]: sortOrder };

      const todos = await Todo.find(filter).sort(sortOptions);

      res.json({
        success: true,
        count: todos.length,
        data: todos
      });
    } catch (error) {
      console.error('Error fetching todos:', error);
      res.status(500).json({
        success: false,
        error: 'Server error while fetching todos',
        message: error.message
      });
    }
  }
);

router.get(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid todo ID')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);

      if (!todo) {
        return res.status(404).json({
          success: false,
          error: 'Todo not found'
        });
      }

      res.json({
        success: true,
        data: todo
      });
    } catch (error) {
      console.error('Error fetching todo:', error);
      res.status(500).json({
        success: false,
        error: 'Server error while fetching todo',
        message: error.message
      });
    }
  }
);

router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { title, description, priority } = req.body;

      const todo = new Todo({
        title,
        description: description || '',
        completed: false,
        priority: priority || 'medium'
      });

      await todo.save();

      res.status(201).json({
        success: true,
        data: todo
      });
    } catch (error) {
      console.error('Error creating todo:', error);
      res.status(400).json({
        success: false,
        error: 'Error creating todo',
        message: error.message
      });
    }
  }
);

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid todo ID'),
    body('title')
      .optional()
      .trim()
      .notEmpty().withMessage('Title cannot be empty')
      .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('completed')
      .optional()
      .isBoolean().withMessage('Completed must be a boolean'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { title, description, completed, priority } = req.body;

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (completed !== undefined) updateData.completed = completed;
      if (priority !== undefined) updateData.priority = priority;

      const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!todo) {
        return res.status(404).json({
          success: false,
          error: 'Todo not found'
        });
      }

      res.json({
        success: true,
        data: todo
      });
    } catch (error) {
      console.error('Error updating todo:', error);
      res.status(400).json({
        success: false,
        error: 'Error updating todo',
        message: error.message
      });
    }
  }
);

router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid todo ID')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const todo = await Todo.findByIdAndDelete(req.params.id);

      if (!todo) {
        return res.status(404).json({
          success: false,
          error: 'Todo not found'
        });
      }

      res.json({
        success: true,
        message: 'Todo deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      res.status(500).json({
        success: false,
        error: 'Server error while deleting todo',
        message: error.message
      });
    }
  }
);

module.exports = router;

