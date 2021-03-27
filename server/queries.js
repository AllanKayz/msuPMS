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
    ",row_to_json((SELECT l FROM(SELECT id, status, zone) As l)) As properties FROM parkingslots;";

const getParkingSlots = (request, response) => {
    pool.query(parkingSlots, (error, results) => {
        if (error) { throw error } response.status(200).json(results.rows);
    });
};

const updateSlot = (request, response) => {
    const { id, status } = request.body;
    pool.query('UPDATE parkingslots SET status = $1 WHERE id = $2', [status, id], (error, results) => {
        if (error) { throw error } response.status(200).json(`Slot modified with ID: ${id}`);
    });
};

const multipleUpdation = (request, response) => {
    const { status } = request.body;
    pool.query('UPDATE parkingslots SET status = $1', [status], (error, results) => {
        if (error) { throw error } response.status(200).json(`All Slots Updated To Status ${status}`)
    });
}

const bookSlot = (request, response) => {
    const { status, id } = request.body;
    pool.query('UPDATE parkingslots SET status = $1 WHERE id = $2', [status, id], (error, results) => {
        if (error) { throw error } response.status(200).json(`Slot with ID: ${id} booked`);
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



module.exports = { getParkingSlots, bookSlot, multipleUpdation, getUserByEmail, updateSlot, getBuildings, getRoads }
