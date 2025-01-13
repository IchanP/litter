import React from 'react'
import Menu from "../components/Menu";
import Search from '../components/Search';
import { useParams } from 'react-router-dom';

import '../style/PedigreeChart.css'
import MyLitts from '../components/MyLitts';
import Profile from '../components/Profile';

const ProfilePage = () => {
    const { id } = useParams()
    console.log(id)
    return (
        <div className="container">
            <div className='pedigree-chart'>
                <div className="left-column">
                    <Menu />
                </div>

                <div className="middle-column">
                    <Profile userId={id} />
                    <MyLitts id={id} />
                </div>

                    <div className='right-column'>
                        <Search />
                    </div>
            </div>
        </div>
    )
}

export default ProfilePage;