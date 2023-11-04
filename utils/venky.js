import bcrypt from 'bcryptjs';
const saltRounds = 10; // You can adjust the number of salt rounds
import { User } from '../models/User.js';
export async function encryptObject(detailsObject) {
    try {
        const detailsString = JSON.stringify(detailsObject);
        const hash = await bcrypt.hash(detailsString, saltRounds);
        return hash;
    } catch (error) {
        throw error;
    }
}

export async function decryptObject(hash) {
    try {
        const detailsString = await bcrypt.compare(hash, saltRounds);
        const detailsObject = JSON.parse(detailsString);
        return detailsObject;
    } catch (error) {
        throw error;
    }
}

export async function authenticateUser(email, password) {
    try {
        // Find a user with the provided email
        const user = await User.findOne({ email });

        if (!user) {
            // User not found
            return false;
        }

        // Check if the provided password matches the user's hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // Authentication successful
            return true;
        } else {
            // Authentication failed
            return false;
        }
    } catch (error) {
        // Handle database errors
        console.error(error);
        return false; // Authentication failed due to an error
    }
}