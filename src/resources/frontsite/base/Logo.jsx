import React from 'react';
import LogoImage from '../../../assets/images/logo.jpg';

const Logo = () => (
    <div className="relative w-full h-8 ">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img
                src={LogoImage}
                alt="logo"
                className="w-24 h-24 rounded-full border-2 border-gray-300 mb-16"
            />
        </div>
    </div>
);

export default Logo;