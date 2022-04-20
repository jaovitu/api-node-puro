import UserService from "./services/UserService.mjs";

export default [
    {
        endpoint: '/users',
        method: 'GET',
        handler: UserService.listUsers
    },

    {
        endpoint: '/users/:id',
        method: 'GET',
        handler: UserService.getUserById
    },

    {
        endpoint: '/users',
        method: 'POST',
        handler: UserService.createUser
    },

    {
        endpoint: '/users/:id',
        method: 'PUT',
        handler: UserService.updateUser
    },

    {
        endpoint: '/users/:id',
        method: 'DELETE',
        handler: UserService.deleteUser
    }
];
