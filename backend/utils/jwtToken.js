export const generateToken = (user, res) => {
    const token = user.generateJsonWebToken();
    // Xác định tên cookie dựa trên role của user
    const cookieName = 
        user.role === "Admin" ? "adminToken" : 
        user.role === "Doctor" ? "doctorToken" : 
        "patientToken";
    res.cookie(cookieName, token, {
        
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 60 * 60 * 1000),
        httpOnly: true,
        secure: false,
    });
};
