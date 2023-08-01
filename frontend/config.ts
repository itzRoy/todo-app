export default {
    api: import.meta.env.VITE_APP_API,
    endpoints: {
        login: '/user/login',
        signup: '/user/signup',
        todo: '/todo',
    },

    routes: {
        login: '/',
        todo: '/todo',
    },
}
