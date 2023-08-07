export default {
    api: import.meta.env.VITE_APP_API,
    isGraphQL: import.meta.env.VITE_IS_GRAPHQL === 'false' ? false : true,

    endpoints: {
        login: '/user/login',
        loginGL: '/graphql/auth',
        signup: '/user/signup',
        signupGL: '/graphql/auth',
        todo: '/todo',
        todoGL: '/graphql',
    },

    routes: {
        login: '/',
        todo: '/todo',
    },
}
