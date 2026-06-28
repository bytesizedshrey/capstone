import jwt from 'jsonwebtoken'

export function verifyToken(token){
    try{
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch {
        console.error('Token verification failed : ', error)
        return null
    }
}