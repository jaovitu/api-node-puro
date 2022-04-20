import UserRepository from "../repository/UserRepository.mjs";
import path from "path";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


class UserService {

    constructor() {
        this._repository = new UserRepository( path.join(__dirname, '..', 'data.json') );
    }

    async listUsers( request, response ) {
        const users = await this._repository.getUsers();

        let { order } = request.query;

        order = order ? order.toLowerCase() : order;

        const sortedUsers = users.sort( ( a, b ) => {
            if( order === 'desc' ) {
                return a.id < b.id ? 1 : -1;
            }

            return a.id > b.id ? 1 : -1;
        } );

        response.send( 200, sortedUsers );
    }

    async getUserById( request, response ) {
        const { id } = request.params;

        const user = await this._repository.getUserById(id);

        if(!user) {
            return response.send( 404, { error: 'User not found.' } );
        }

        response.send( 200, user );

    }

    async createUser( request, response ) {
        const { name, email } = request.body;

        const users = await this._repository.getUsers();

        const newUser = {
            id: users.length + 1,
            name,
            email
        }

        const createdUser = await this._repository.createUser(newUser);

        response.send( 200, createdUser );
    }

    async updateUser( request, response ) {
        const { id } = request.params;
        const data = request.body;

        const user = await this._repository.getUserById(id);

        if(!user) {
            return response.send( 404, { error: 'User not found.' } );
        }

        const newUser = { ...user, ...data };

        const updatedUser = await this._repository.updateUser(id, newUser);

        response.send( 200, updatedUser );
    }

    async deleteUser( request, response ) {
        const { id } = request.params;

        const user = await this._repository.getUserById(id);

        if(!user) {
            return response.send( 404, { error: 'User not found.' } );
        }

        await this._repository.deleteUser(id);

        response.send( 200, user );
    }
}

export default new UserService();
