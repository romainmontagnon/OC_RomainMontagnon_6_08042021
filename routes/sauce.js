const express = require ('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');

router.get('/', sauceCtrl.getAllSauce);
router.get('/:id', sauceCtrl.getOneSauce);
router.post('/', sauceCtrl.createSauce);
router.put('/:id', sauceCtrl.modifySauce);
router.delete('/sauces/:id', sauceCtrl.deleteSauce);

router.post('/:id/like', sauceCtrl.likedSauce);

module.exports = router;