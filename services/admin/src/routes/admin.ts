import {Router} from 'express'
import { authmiddle, isadmin } from '../middlewares/auth.middleware.js'
import { getpendingrest, getpendingriders, verifyrest, verifyrider } from '../controllers/admin.js'

const adminroutes = Router()


adminroutes.get('/rest/pending',authmiddle,isadmin,getpendingrest)
adminroutes.get('/rider/pending',authmiddle,isadmin,getpendingriders)
adminroutes.patch('/verify/rider/:id',authmiddle,isadmin,verifyrider)
adminroutes.patch('/verify/rest/:id',authmiddle,isadmin,verifyrest)


export default adminroutes