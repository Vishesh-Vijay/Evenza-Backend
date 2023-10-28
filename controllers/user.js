import { User } from "../models/User.js"
import { OAuth2Client } from 'google-auth-library';
import url from 'url';
import * as dotenv from "dotenv";
import { encryptObject } from '../utils/venky.js';
import { decryptObject } from '../utils/venky.js';
dotenv.config();

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI

const client = new OAuth2Client(clientId, clientSecret, redirectUri);

export async function signIn(req, res) {
  // console.log(redirectUri)
  const qs = new url.URL(req.url, 'http://localhost:8080').searchParams
  // console.log(qs)
  const code = qs.get('code')
  // console.log(code)
  try {
    let idtoken = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: idtoken.tokens.id_token,
      audience: clientId,
    });
    const { name, email } = ticket.getPayload()
    const alreadyUser = await User.find({ where: { emailId: email } })
    if (!alreadyUser.length) {
      console.log('creating new user')
      const createdUser = new User({
        name,
        email,
        password: null,
        phoneNumber: "blahblah"
      })
      await createdUser.save()
      //generate a qr string with all these details, and then update the qr string in the database
      const qrString = JSON.stringify({ name, email })
      const qrCode = await encryptObject(qrString)
      await User.update({ where: { emailId: email } }, {
        qrCode
      })
      return createdUser.generateAuthToken;
    }
    else {
      //   console.log(alreadyUser)
      console.log('user already present')
      return alreadyUser.generateAuthToken;
    }
    res.status(201).send("Function completed successfully")
  }
  catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
}
