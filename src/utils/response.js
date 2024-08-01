const sendResponse = (res, data, status = 200) => {
    res.status(status).json(data);
};

const sendError = (res, error, status = 500) => {
    res.status(status).json({ error: error.message || error });
};

module.exports = {
    sendResponse,
    sendError
};