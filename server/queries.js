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
    ",row_to_json((SELECT l FROM(SELECT id, status, zone, color) As l)) As properties FROM parkingslots;";

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

const msu_buildings = "SELECT 'Feature' As type, ST_ASGeoJSON(geom):: json As geometry" +
    ",row_to_json((SELECT l FROM(SELECT building_id, name) As l)) As properties FROM msu_buildings;";

const getBuildings = (request, response) => {
    pool.query(msu_buildings, (error, results) => {
        if (error) { throw error } response.status(200).json(results.rows);
    });
};

const msu_roads = "SELECT 'Feature' As type, ST_ASGeoJSON(geom):: json As geometry" +
    ",row_to_json((SELECT l FROM(SELECT road_id, name) As l)) As properties FROM msu_roads;";

const getRoads = (request, response) => {
    pool.query(msu_roads, (error, results) => {
        if (error) { throw error } response.status(200).json(results.rows);
    });
};



module.exports = { getParkingSlots, getUserByEmail, updateSlot, getBuildings, getRoads }
