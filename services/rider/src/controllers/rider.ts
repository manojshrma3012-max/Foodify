import axios from "axios"
import FormData from "form-data"
import { AuthenticatedRequest } from "../middlewares/isAuth.js"
import TryCatch from "../middlewares/trycatch.js"

export const addriderprofile = TryCatch(
    async (req: AuthenticatedRequest, res) => {

        const user = req.user
        if (!user) {
            return res.status(401).json({
                message: "Unauthorised"
            })
        }
        if (user.role !== "rider") {
            return res.status(403).json({
                message: "User must be rider"
            })
        }
        const file = req.file

        if (!file) {
            return res.status(400).json({
                message: "File not found"
            })
        }
        const form = new FormData()
        form.append("folder", "rider")
        form.append("file", file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype
        })
        const { data } = await axios.post(
            "http://localhost:5002/api/uploads",
            form,
            {
                headers: {
                    ...form.getHeaders()
                }
            }
        )

      
    }
)