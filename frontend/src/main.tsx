import { createRoot } from 'react-dom/client'
import './index.css'
import {GoogleOAuthProvider} from '@react-oauth/google'
import App from './App.tsx'
import { Appprovider } from './context/AppContext.tsx'
export const serviceurl = "http://localhost:5000"

createRoot(document.getElementById('root')!).render(
 <GoogleOAuthProvider clientId='684712621226-h7r0aont55jt450t3luadav7o5be23gg.apps.googleusercontent.com'>
    <Appprovider>
        <App />
    </Appprovider>
 </GoogleOAuthProvider>
)
