import {User} from "../models/User.js"
import {OAuth2Client} from 'google-auth-library';
import url from 'url';

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI

const client = new OAuth2Client(clientId,clientSecret,redirectUri);

export async function signIn(req,res){
    const qs = new url.URL(req.url, 'http://localhost:8080').searchParams
    console.log(qs)
    const code = qs.get('code')
    try{
        let idtoken = await client.getToken(code);
        const ticket = await client.verifyIdToken({
          idToken: idtoken.tokens.id_token,
          audience: clientId,
        });
        const {name,email} = ticket.getPayload()
        const alreadyUser = await User.find({where:{emailId:email}})
        if(!alreadyUser.length){
          console.log('creating new user')
        //   const createdUser = await addUser({
        //     name,
        //     username:name,
        //     emailId:email,
        //     password: null,
        //     iiita:isIiitaUser(email)
        //   })
        //   generateAuthToken(createdUser)
        }
        else{
        //   console.log(alreadyUser)
          console.log('user already present')
        //   generateAuthToken(alreadyUser[0])
        }
        res.status(201).send("Function completed successfully")
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}