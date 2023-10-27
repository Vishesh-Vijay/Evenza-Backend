import bcrypt from 'bcryptjs';
const saltRounds = 10; // You can adjust the number of salt rounds

async function encryptObject(detailsObject) {
    try {
        const detailsString = JSON.stringify(detailsObject);
        const hash = await bcrypt.hash(detailsString, saltRounds);
        return hash;
    } catch (error) {
        throw error;
    }
}

async function decryptObject(hash) {
    try {
        const detailsString = await bcrypt.compare(hash, saltRounds);
        const detailsObject = JSON.parse(detailsString);
        return detailsObject;
    } catch (error) {
        throw error;
    }
}