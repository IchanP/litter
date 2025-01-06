import { model, Schema } from 'mongoose';

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    followers: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        }
    ],
    following: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const UserModel = model('User', userSchema);