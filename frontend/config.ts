export default {
    api: import.meta.env.REACT_APP_API,

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
