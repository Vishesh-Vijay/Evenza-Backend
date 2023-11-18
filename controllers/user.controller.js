import { User } from "../models/user.model.js";
import { Events } from "../models/event.model.js";
import { OAuth2Client } from "google-auth-library";
import url from "url";
import * as dotenv from "dotenv";
import { encryptObject } from "../utils/venky.js";
// import bcrypt from 'bcrypt';
import bcrypt from "bcrypt";
import { authenticateUser } from "../utils/venky.js";
// import { decryptObject } from '../utils/venky.js';
import jwt from "jsonwebtoken";
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import validator from "validator";
dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const s3 = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
    },
});

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;

const client = new OAuth2Client(clientId, clientSecret, redirectUri);

// export async function signIn(req, res) {
//   // console.log(redirectUri)
//   const qs = new url.URL(req.url, 'http://localhost:8080').searchParams
//   // console.log(qs)
//   const code = qs.get('code')
//   // console.log(code)
//   try {
//     let idtoken = await client.getToken(code);
//     const ticket = await client.verifyIdToken({
//       idToken: idtoken.tokens.id_token,
//       audience: clientId,
//     });
//     const { name, email } = ticket.getPayload()
//     const alreadyUser = await User.find({ where: { emailId: email } })
//     if (!alreadyUser.length) {
//       console.log('creating new user')
//       const createdUser = new User({
//         name,
//         email,
//         password: null,
//         phoneNumber: "blahblah"
//       })
//       await createdUser.save()
//       //generate a qr string with all these details, and then update the qr string in the database
//       const qrString = JSON.stringify({ name, email })
//       const qrCode = await encryptObject(qrString)
//       await User.update({ where: { emailId: email } }, {
//         qrCode
//       })
//       return createdUser.generateAuthToken;
//     }
//     else {
//       //   console.log(alreadyUser)
//       console.log('user already present')
//       return alreadyUser.generateAuthToken;
//     }
//     res.status(201).send("Function completed successfully")
//   }
//   catch (e) {
//     console.log(e)
//     res.status(500).send(e)
//   }
// }

// export async function LogIn(req, res) {
//     try {
//         // Get user credentials from the request body
//         const { email, password } = req.body;

//         // Perform authentication (check credentials)
//         const isAuthenticated = await authenticateUser(email, password);

//         if (isAuthenticated) {
//             // Authentication successful
//             res.status(200).json({ message: 'Login successful' });
//         } else {
//             // Authentication failed
//             res.status(401).json({ message: 'Login failed: Invalid credentials' });
//         }
//     } catch (error) {
//         // Handle other errors (e.g., database errors, network errors)
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred while logging in' });
//     }
// }

export async function Register(req, res) {
    try {
        const {
            name,
            password,
            email,
            phoneNumber,
            isAdmin,
            institute,
        } = req.body;

        if (!name || !password || !email || !institute) {
            return res.status(400).send({ error: "All required fields not present" })
        }

        if (!validator.isEmail(email) || !validator.isMobilePhone(phoneNumber)) {
            return res.status(400).send({ error: "Invalid email or phone number" })
        }

        // Hash the user's password before saving it
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const combinedString = email + password;
        const hashedQR = crypto
            .createHash("sha256")
            .update(combinedString)
            .digest("hex");

        // Create a new user document in the database
        const user = new User({
            name,
            qr: hashedQR,
            password: hashedPassword, // Store the hashed password
            email,
            phoneNumber,
            isAdmin,
            institute,
        });

        await user.save();

        res.status(201).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while registering the user",
        });
    }
}

export async function GetAllUsers(req, res) {
    try {
        // Find all users in the database
        const users = await User.find({});

        // Return the list of users
        res.status(200).json({ users });
    } catch (error) {
        // Handle errors (e.g., database errors, network errors)
        console.error(error);
        res.status(500).json({
            error: "An error occurred while fetching users",
        });
    }
}

export async function LogIn(req, res) {
    try {
        // Get user credentials from the request body
        const { email, password } = req.body;

        // Perform authentication (check credentials)
        const isAuthenticated = await authenticateUser(email, password);

        if (isAuthenticated) {
            // Authentication successful, generate a JWT token
            const user = await User.findOne({ email });
            const token = user.generateAuthToken();

            // Send the token in the response
            res.status(200).json({ message: "Login successful", token, email });
        } else {
            // Authentication failed
            res.status(401).json({
                message: "Login failed: Invalid credentials",
            });
        }
    } catch (error) {
        // Handle other errors (e.g., database errors, network errors)
        console.error(error);
        res.status(500).json({ error: "An error occurred while logging in" });
    }
}
// export async function getUserDetailsById(req, res) {
//     try {
//         // console.log(req.params);
//         const email = req.params.userId;
//         console.log(email);
//         const user = await User.findOne({ email: email });
//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         res.status(200).json({ user });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             error: "An error occurred while fetching user details",
//         });
//     }
// }
export async function getUserDetailsById(req, res) {
    try {
        const email = req.params.userId;

        const user = await User.findOne({email}).populate('registered');
        for(let i=0 ; i<user.registered.length ; i++){
            const id = user.registered[i]._id
            const event = await Events.findById(id);
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }
            const getObjectParams = {
                Bucket: bucketName,
                Key: event.image,
            };
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            user.registered[i].url = url;
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while fetching user details",
        });
    }
}


export async function dropCollection(req, res) {
    User.collection.drop()
    res.status(200).send("User collection drop")
}

