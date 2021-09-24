import jwt from 'express-jwt';
import RefreshToken from '../models/refresh-token';
import User from '../models/user';

function authorize(roles:string[] = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    const secret=process.env.SECRET_TOKEN || '';

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret, algorithms: ['HS256'] }),

        // authorize based on user role
        async (req, res, next) => {
            const user = await User.findById(req.user.userId);
           

            if (!user || (roles.length && !roles.includes(user.role))) {
                // user no longer exists or role not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            req.user.role = user.role;
            const refreshTokens = await RefreshToken.find({ user: user._id });
            req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
            
            next();
        }
    ];
}

export default authorize;
