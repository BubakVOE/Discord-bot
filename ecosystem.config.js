module.exports = {
    apps: [
        {
            name: 'express-ts-template',
            script: 'tsconfig-paths-bootstrap.js',
            watch: false,
            env: {
                NODE_ENV: 'development'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ]
};
