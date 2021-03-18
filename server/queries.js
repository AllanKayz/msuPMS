const parseDbObj = require('parse-ini');
const dbParams = parseDbObj.parse('config/config.ini');
const Pool = require('pg').Pool;

const pool = new Pool({
    user: dbParams.user,
    host: dbParams.host,
    database: dbParams.database,
    password: dbParams.password,
    port: dbParams.port
});

const getUserByEmail = (request, response) => {
    const email = request.params.email;
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
        if (error) { throw error } response.status(200).json(results.rows);
    });
};

const parkingSlots = "SELECT 'Feature' As type ,ST_AsGeoJSON(geom):: json As geometry" +
    ",row_to_json((SELECT l FROM(SELECT slotID, status, zone) As l)) As properties FROM parkingslots;";

const getParkingSlots = (request, response) => {
    pool.query(parkingSlots, (error, results) => {
        if (error) { throw error } response.status(200).json(results.rows);
    });
};

const updateSlot = (request, response) => {
    const slotID = parseInt(request.params.slotID);
    const { status, zone } = request.body;
    pool.query('UPDATE parkingslots SET status = $1, zone = $2 WHERE slotID = $3', [status, zone, slotID], (error, results) => {
        if (error) { throw error } response.status(200).send(`User modified with ID: ${slotID}`);
    });
};

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC',
        (error, results) => { if (error) { throw error } response.status(200).json(results.rows); });
}

module.exports = { getUsers, getParkingSlots, getUserByEmail, updateSlot }
