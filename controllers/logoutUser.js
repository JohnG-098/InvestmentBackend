const logoutUser = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // set true in production (HTTPS)
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
      redirect: "/login",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong during logout",
    });
  }
};

module.exports = logoutUser;