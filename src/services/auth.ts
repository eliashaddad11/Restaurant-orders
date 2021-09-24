import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/user';
import RefreshToken from '../models/refresh-token';
import HttpException from '../exceptions/HttpException';


async function authenticate({ email, password, ipAddress }) {
    const user = await User.findOne({ email:email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new HttpException(401, 'Email or password is incorrect');
    }

    if(user.status===0)
    {
        throw new HttpException(401, 'User is disabled');
    }
    // authentication successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(user);
    const refreshToken = generateRefreshToken(user, ipAddress);

    // save refresh token
    await refreshToken.save();

    // return basic details and tokens
    return { 
        ...basicDetails(user),
        jwtToken,
        refreshToken: (refreshToken as any).token
    };
}

async function refreshToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);
    const { user } = refreshToken;

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(user, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = (newRefreshToken as any).token;
    await refreshToken.save();
    await newRefreshToken.save();

    // generate new jwt
    const jwtToken = generateJwtToken(user);

    // return basic details and tokens
    return { 
        ...basicDetails(user),
        jwtToken,
        refreshToken: (newRefreshToken as any).token
    };
}

async function revokeToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);

    // revoke token and save
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
}


async function getRefreshTokens(userId) {
    // check that user exists
    await getUser(userId);

    // return refresh tokens for user
    const refreshTokens = await RefreshToken.find({ user: userId });
    return refreshTokens;
}

// helper functions

async function getUser(id) {
    //if (! User.findOne({_id:id})) throw 'User not found';
    const user = await User.findById(id);
    if (!user) throw 'User not found';
    if (user.status===0) throw 'User is disabled';
    return user;
}

async function getRefreshToken(token) {
    const refreshToken = await RefreshToken.findOne({ token:token }).populate('user');
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
}

function generateJwtToken(user) {
    // create a jwt token containing the user id that expires in 15 minutes
    return jwt.sign({ email: user.email,userId: user._id.toString() }, process.env.SECRET_TOKEN?process.env.SECRET_TOKEN:'', { expiresIn: '24h' });
}

function generateRefreshToken(user, ipAddress) {
    // create a refresh token that expires in 7 days
    return new RefreshToken({
        user: user._id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createdByIp: ipAddress
    });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function basicDetails(user) {
    const { _id,name, email, role } = user;
    return { _id, name, email, role };
}


export default {
    authenticate,
    refreshToken,
    revokeToken,
    getRefreshTokens
};
