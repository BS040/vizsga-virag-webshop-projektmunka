import express from 'express';
import { loginUser, registerUser, adminLogin, getAllUsers, deactivateUser  } from '../controllers/userController.js';

const userRouter = express.Router();

// userRouter.get("/reset-password/:token", (req, res) => {
//     const { token } = req.params;

//     res.send(`Jelszó visszaállítás: ${token}`);
// });

// userRouter.post("/reset-password/:token", resetPassword);

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/', getAllUsers);

userRouter.patch('/:id/status', deactivateUser);

// userRouter.post("/forgot-password", forgotPassword);

export default userRouter;
