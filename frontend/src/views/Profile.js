import React from 'react'
import Menu from "../components/Menu";
import Search from '../components/Search';
import { useParams } from 'react-router-dom';

import '../style/PedigreeChart.css'
import UserProfile from '../components/UserProfile';
import UserLitts from '../components/UserLitts';

const Profile = () => {
    const { id } = useParams()
    console.log(id)
    return (
        <div className="container">
            <div className='pedigree-chart'>
                <div className="left-column">
                    <Menu />
                </div>

                <div className="middle-column">
                    <UserProfile userId={id} />
                    <UserLitts id={id} />
                </div>

                    <div className='right-column'>
                        <Search />
                    </div>
            </div>
        </div>
    )
}

export default Profile;