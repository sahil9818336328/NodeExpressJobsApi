const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'company is required'],
      maxlength: 20,
    },
    position: {
      type: String,
      required: [true, 'position is required'],
      maxlength: 20,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'user is required'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Job', jobSchema)
