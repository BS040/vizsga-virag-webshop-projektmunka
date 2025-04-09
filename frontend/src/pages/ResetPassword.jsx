// import React, { useContext, useState, useEffect } from "react";
// import axios from "axios";

// const ResetPassword = () => {
//     const [newPassword, setNewPassword] = useState("");
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     const resetToken = window.location.pathname.split("/").pop();

//     const ResetPassword = async (newPassword, resetToken) => {
//         try {
//             const response = await axios.post(
//                 `${process.env.BASE_URL}/api/user/reset-password/${resetToken}`,
//                 { newPassword }
//             );
//             console.log(response.data);
//             setSuccess("Jelszó sikeresen visszaállítva.");
//         } catch (error) {
//             console.error("Hiba történt:", error.response ? error.response.data : error.message);
//             setError("Hiba történt a jelszó visszaállítás során.");
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!newPassword) {
//             setError("Jelszó megadása szuksegés!");
//             return;
//         }
//         ResetPassword(newPassword, resetToken);
//     };

//     return (
//         <div>
//             <h2 className="text-2xl font-semibold mb-4">Jelszó visszaállítás</h2>
//             <form onSubmit={handleSubmit}>
//                 <input 
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 placeholder="Új jelszó"
//                 required
//                 />
//                 <button type="submit">Visszaállítás</button>
//             </form>
//             {error && <p className="text-red-500 mt-2">{error}</p>}
//             {success && <p className="text-green-500 mt-2">{success}</p>}
//         </div>
//     );
// };

// export default ResetPassword;