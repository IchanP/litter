const isLocalHost = window.location.hostname === 'localhost';

const url = isLocalHost
    ? 'http://localhost:1337'
    : 'https://cscloud8-120.lnu.se/';

export { url };