const express = require('express');
const cors = require('cors');
const router = express.Router();

router.options('*', cors());

router.route('/query').post(async function (req, res) {
    let kustoClient = req.app.locals.kustoClient;
    console.log(req.text);
    try {
        const results = await kustoClient.execute("IntuneTelemetry_EUDB_Test", req.text);
        res.send(results.primaryResults[0]);
    } catch (err) {
        res.status(400).send(JSON.stringify(err['message']));
    }

})

module.exports = router;
