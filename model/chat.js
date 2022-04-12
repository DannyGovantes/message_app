const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    modifiedAt: {
        type: Date,
        default:Date.now()
    }
},{
    toJSON: {virtuals: true},
    toObject:{virtuals:true}
});
chatSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'participants',
        select: 'name '
    })
    next();
});
const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;