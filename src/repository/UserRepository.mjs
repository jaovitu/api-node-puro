import { readFile, writeFile } from 'fs/promises';

class UserRepository {

    constructor(filePah) {
        this._filePah = filePah;

        this._currentData = async () => {
            try {
                const data = await readFile(this._filePah, { encoding: 'utf-8' });

                return JSON.parse(data);

            } catch(error) {
                console.log(error);
            }
        };

        this._saveData = async (data) => {
            await writeFile(this._filePah, JSON.stringify(data));
        };
    }

    async getUsers() {
        const users = await this._currentData();

        return users;
    }

    async getUserById(id) {
        const users = await this._currentData();

        const user = users.find( user => user.id === Number(id) );

        return user;
    }

    async createUser(user) {
        let users = await this._currentData();

        users.push(user);

        this._saveData(users);

        return user;
    }

    async updateUser(id, newUser) {
        let users = await this._currentData();

        users = users.map( user => user.id === Number(id) ? newUser : user );

        await this._saveData( users );

        return newUser;
    }

    async deleteUser(id) {
        let users = await this._currentData();

        users = users.filter( user => user.id !== Number(id) );

        await this._saveData( users );
    }
}

export default UserRepository;
