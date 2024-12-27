import { Router } from 'express';
import { createUser, getUser, updateUser, deleteUser, searchUsers, getSortedUsers } from '../controllers/userController';

const router = Router();

router.post('/users', createUser);
router.get('/users/:username', getUser);
router.put('/users/:username', updateUser);
router.delete('/users/:username', deleteUser);
router.get('/search', searchUsers);
router.get('/users', getSortedUsers);

export default router;