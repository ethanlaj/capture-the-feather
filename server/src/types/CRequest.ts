import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'

export interface CRequest extends Request {
	payload: JwtPayload;
}