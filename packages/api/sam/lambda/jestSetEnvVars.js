const json = require('../env.json');

const setEnvVariables = (json) => {
    for (const [key, value] of Object.entries(json.Parameters)) {
        process.env[key] = value;
    }
};

setEnvVariables(json);
