const jwt = require('jsonwebtoken');
const status = require('http-status');

module.exports = container => {
    const { Account } = container.resolve('repos');
    const logger = container.resolve('logger');

    logger.info('Wiring authentication middlewares');

    const requireAuthEmail = (req, res, next) => {
        const token = req.headers['authorization'];
        
        if (!token) {
            return res.status(status.UNAUTHORIZED).send({
                success: false,
                message: 'This site require authorization'
            });
        }
    
    
        jwt.verify(token, process.env.JWT_SECRET, function (err, decodedPayload) {
            if (err)
                return res.status(status.UNAUTHORIZED).send({
                    success: false,
                    message: 'Token invalid',
                    errors: {
                        authorization: err
                    }
                });
            
            Account.findById(decodedPayload.id)
                .then( function (err, account) {
                    if (err) return next(err);
    
                    if (!account)
                        return res.status(status.OK).send({
                            success: false,
                            message: 'Account does not exit'
                        });
    
                    if (!account.isVerified) {
                        return res.status(status.UNAUTHORIZED).send({
                            success: false,
                            isVerified: false,
                            message: 'Account has not been verified'
                        });
                    }
                    
                    req.user = decodedPayload;
                    next();
                })
                .catch(next);
        });
    };
    
    const requireAuth = (req, res, next) => {
        const token = req.headers['authorization'];
        
        if (!token) {
            return res.status(status.UNAUTHORIZED).send({
                success: false,
                message: 'This site require authorization'
            });
        }
    
    
        jwt.verify(token, process.env.JWT_SECRET, function (err, decodedPayload) {
            if (err)
                return res.status(status.UNAUTHORIZED).send({
                    success: false,
                    message: 'Token invalid',
                    errors: {
                        authorization: err
                    }
                });
            
            req.user = decodedPayload;
            next();
        });
    };
    
    const requireRole = roles => (req, res, next) => {
        Account.findRolesById(req.user._id)
            .then((accountRoles) => {
                if (roles.some(role => accountRoles.includes(role)))
                    return next();
                
                res.status(status.FORBIDDEN).send({
                    success: false,
                    message: 'Do not have permission to access this resource',
                    errors: {
                        authorization: {
                            "name": "RequireRoleError",
                            "message": "Do not have permission to access this resource"
                        }
                    }
                });
            })
            .catch(next);
    };
    
    return {
        requireAuth,
        requireAuthEmail,
        requireRole
    }
}
