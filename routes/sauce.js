const express = require ('express');
const router = express.Router();

const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth');

const sauceCtrl = require('../controllers/sauce');

router.get('/', auth, sauceCtrl.getAllSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/sauces/:id', auth, sauceCtrl.deleteSauce);

router.post('/:id/like', sauceCtrl.likedSauce);

module.exports = router;