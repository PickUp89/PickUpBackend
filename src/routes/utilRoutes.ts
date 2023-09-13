import express from 'express';
import Sports from '../../src/models/SportEnum';
const router = express.Router();

router.get('/getAllSports', (req, res) => {
    try {
        res.status(200).json({ Sports });
    } catch(err) {
        res.status(500).json({ Error: 'Cant get all sports' });
    }
});

export default router;