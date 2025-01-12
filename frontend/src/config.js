const isLocalHost = window.location.hostname === 'localhost';

const url = isLocalHost
    ? 'http://localhost:3000' // port 3000?
    : 'https://cscloud8-120.lnu.se/';

export { url };
