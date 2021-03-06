module.exports = {
    reactStrictMode: true,
    poweredByHeader: false,
    publicRuntimeConfig: {
        API_URL: process.env.API_URL
    },
    async redirects() {
        return [
            {
                source: '/mes-traitements',
                destination: '/',
                permanent: true
            },
            {
                source: '/login',
                destination: '/',
                permanent: true
            }
        ];
    }
};
