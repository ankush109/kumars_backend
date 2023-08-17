const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const User = require("../models/usermodels");
const router = express.Router();
const catchasyncerror = require("../middelware/catchasyncerror");

const clientId = "381683308790-2df2pegumahvgjuiudcav6l3mevderdv.apps.googleusercontent.com";
const authClient = new OAuth2Client(clientId);

const guser = catchasyncerror(async (req, res) => {
    const { idToken } = req.body;
    if (idToken) {
        try {
            const response = await authClient.verifyIdToken({ idToken, audience: clientId });
            const { email_verified, email, name, picture } = response.payload;

            if (email_verified) {
                const user = await User.findOne({ email }).exec();

                if (user) {
                    return res.json(user);
                } else {
                    const password = email + clientId;
                    const newUser = await User.create({ name, email, password });
                    console.log(newUser);
                 
                    newUser.save((err, data) => {
                        if (err) {
                            return res.status(500).json({ error: "mongodb error" });
                        }
                        res.json(data);
                    });
                }
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "server error" });
        }
    }
});

router.route('/googlelogin').post(guser);

module.exports = router;
