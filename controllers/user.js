import { User } from "../models/User.js"
import { OAuth2Client } from 'google-auth-library';
import url from 'url';
import * as dotenv from "dotenv";
import { encryptObject } from '../utils/venky.js';
// import bcrypt from 'bcrypt';
import bcrypt from 'bcrypt';
import { authenticateUser } from '../utils/venky.js';
// import { decryptObject } from '../utils/venky.js';
import jwt from 'jsonwebtoken';
dotenv.config();

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI

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
            qr,
            password,
            email,
            phoneNumber,
            isAdmin,
            isChor,
            institute,
        } = req.body;

        // Hash the user's password before saving it
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user document in the database
        const user = new User({
            name,
            qr,
            password: hashedPassword, // Store the hashed password
            email,
            phoneNumber,
            isAdmin,
            isChor,
            institute,
        });

        await user.save();


        res.status(201).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while registering the user' });
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
        res.status(500).json({ error: 'An error occurred while fetching users' });
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
            res.status(200).json({ message: 'Login successful', token });
        } else {
            // Authentication failed
            res.status(401).json({ message: 'Login failed: Invalid credentials' });
        }
    } catch (error) {
        // Handle other errors (e.g., database errors, network errors)
        console.error(error);
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
}
