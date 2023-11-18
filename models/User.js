import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    qr: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        required: true,
    },
    // googleId: {
    //     type: String,
    //     required: true,
    //     unique: true,
    // },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: false,
        unique: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    // isChor: {
    //     type: Boolean,
    //     default: true,
    // },
    institute: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    registered:
    {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Events',
    },
    attended:
    {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Events',
    },
});

// userSchema.methods.generateAuthToken = async function () {
//     try {
//         let token = jwt.sign(
//             { id: this._id, email: this.email },
//             process.env.SECRET,
//             {
//                 expiresIn: '24h',
//             }
//         );

//         return token;
//     } catch (error) {
//         console.log('Error while generating token');
//     }
// };
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, email: this.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" } // Set the token expiration time
    );
    return token;
};
export const User = mongoose.model("User", userSchema);
