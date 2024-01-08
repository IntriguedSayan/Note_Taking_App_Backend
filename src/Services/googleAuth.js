const session = require("express-session");
const passport = require("passport");
require("dotenv").config();

const GoogleStrategy = require("passport-google-oauth2").Strategy;

const authUser = (request, accessToken, refreshToken, profile, done) =>{

    return done(null, profile);

}

passport.use(new GoogleStrategy({

    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:7600/auth/google/callback",
    passReqToCallback: true

}, authUser));

passport.serializeUser((user, done) =>{

    console.log(user);

    done(null, user);

})

passport.deserializeUser((user, done) =>{

    console.log(user);

    done(null, user);

})









