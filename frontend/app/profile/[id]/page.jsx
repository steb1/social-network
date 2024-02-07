import React from 'react'
import authMiddleware from '@/middleware/authMiddleware';
import config from '@/config';


const Profile = ({params:{id}}) => {
    return (
        <div>Profile {id}</div>
    )
}


export default authMiddleware(Profile, config.serverApiUrl + "checkAuth");
