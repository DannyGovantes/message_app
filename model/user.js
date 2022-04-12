const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Users must have a name']
    },
    email: {
        type: String,
        required: [true, 'Users must have an email'],
        lowecase: true,
        unique: true
    },
    role: {
        type: String,
        enum:  ['doctor','patient','admin'],
        default: 'patient',
       
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    password: {
        type: String,
        required: [true, 'Users must have a password'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'User must have a password'],
   
    },
    chats: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Chat'
        }
    ]

},{
    toJSON: {virtuals: true},
    toObject:{virtuals:true}
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.verifyPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema);
module.exports = User;