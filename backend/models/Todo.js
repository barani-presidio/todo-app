const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        ret._id = ret._id.toString();
        ret.createdAt = ret.createdAt;
        ret.updatedAt = ret.updatedAt;
        return ret;
      }
    }
  }
);

todoSchema.index({ createdAt: -1 });
todoSchema.index({ completed: 1 });
todoSchema.index({ priority: 1 });

module.exports = mongoose.model('Todo', todoSchema);

