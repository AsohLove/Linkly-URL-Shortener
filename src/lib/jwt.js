import jwt  from "jsonwebtoken";

const EXPIRES_IN = "7d"


export function createToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email
        }, 
        JWT_SECRET,
        {
            expiresIn: EXPIRES_IN
        }
    );  
}

export function verifyToken(token){
    return jwt.verify(token, JWT_SECRET);
}