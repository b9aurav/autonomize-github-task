import { Router } from 'express';
import { createUser, getUser, updateUser, deleteUser, searchUsers, getSortedUsers, findAndSaveFriends } from '../controllers/userController';

const router = Router();

router.post('/users', createUser);
router.get('/users/:username', getUser);
router.put('/users/:username', updateUser);
router.delete('/users/:username', deleteUser);
router.get('/search', searchUsers);
router.get('/users', getSortedUsers);
router.post('/users/:username/friends', findAndSaveFriends);

export default router;