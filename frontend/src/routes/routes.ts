export const routes = {
    home: {
        pattern: '/',
        link: '/'
    },
    test: {
        pattern: 'test',
        link: '/test'
    },
    admin: {
        pattern: 'admin',
        link: '/admin'
    },
    login: {
        pattern: 'login',
        link: '/login'
    },
    signup: {
        pattern: 'signup',
        link: '/signup'
    },
    profile: {
        pattern: 'profile',
        link: '/profile'
    },
    notFound: {
        pattern: '*',
        link: '/404'
    }
}

export const basename = '/';