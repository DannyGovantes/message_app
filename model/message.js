const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    body: {
        type: String,
        
    },
    chat: {
        type: mongoose.Schema.ObjectId,
        ref: 'Chat',
        required: true
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required:true
    },
    sentAt: {
        type: Date,
        default: Date.now,
    },
})
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;