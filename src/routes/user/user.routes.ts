// @ts-nocheck

import express from 'express';
import {
    createUser,
    uploadUserAvatar,
    sendPasswordResetCode,
    resetPassword,
    updateUser,
    deleteUser,
} from '../../controllers/user/user.controller';

const router = express.Router();

router.post('/cadastrar', createUser); //ok

router.post('/avatar/:userId', uploadUserAvatar);

router.post('/password-reset-code', sendPasswordResetCode);

router.post('/reset-password', resetPassword);

router.put('/edit/:userId', updateUser); //ok

router.delete('/delete/:userId', deleteUser); //ok

export default router;
