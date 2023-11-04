import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    qr:
    {
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
    isChor: {
        type: Boolean,
        default: true,
    },
    institute: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
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

export const User = mongoose.model("User", userSchema);
