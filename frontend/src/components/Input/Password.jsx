// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import '../../index.css';

// eslint-disable-next-line react/prop-types, no-unused-vars
const Password = ({ value, onChange, placeholder }) => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const toggleShowPassword = () => {
        setIsShowPassword(prev => !prev);
    };

    return (
        <div className="password-container">
            <input
                value={value}
                onChange={onChange}
                type={isShowPassword ? "text" : "password"}
                // placeholder={placeholder || "Password"}
                className='password-input'
            />
            {isShowPassword ? (
                <FaEye
                    size={22}
                    className="password-icon"
                    onClick={toggleShowPassword}
                />
            ) : (
                <FaEyeSlash
                    size={22}
                    className="password-icon"
                    onClick={toggleShowPassword}
                />
            )}
        </div>
    );
}

export default Password;
