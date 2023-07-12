import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
   try {
    const token = req.headers.authorization.split(' ');
    if(token[0] === 'Bearer' && jwt.verify(token[1], 'forsenbruh')) {
        next()
      }
   } catch (error) {
    if(error.name === 'JsonWebTokenError') {res.sendStatus(401);}
    else {
        res.sendStatus(401);
    }

   }
}

export default auth;