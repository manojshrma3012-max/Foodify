import { createRoot } from 'react-dom/client'
import './index.css'
import {GoogleOAuthProvider} from '@react-oauth/google'
import App from './App.tsx'
import { Appprovider } from './context/AppContext.tsx'
import 'leaflet/dist/leaflet.css'
import { SocketProvider } from './context/SocketContext.tsx'
export const serviceurl = "http://localhost:5000"
export const restserviceurl = "http://localhost:5001"
export const utilsserviceurl =  "http://localhost:5002"
export const socketserviceurl =  "http://localhost:5005"
export const riderserviceurl =  "http://localhost:5006"
export const adminserviceurl =  "http://localhost:5007"

createRoot(document.getElementById('root')!).render(
 <GoogleOAuthProvider clientId='684712621226-h7r0aont55jt450t3luadav7o5be23gg.apps.googleusercontent.com'>
    <Appprovider>
        <SocketProvider>
            <App />
        </SocketProvider>
    </Appprovider>
 </GoogleOAuthProvider>
)
