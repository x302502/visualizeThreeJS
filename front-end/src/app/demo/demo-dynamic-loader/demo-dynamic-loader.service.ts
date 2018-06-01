import { Injectable } from '@angular/core';
import * as uuid from 'uuid';

@Injectable()
export class DemoDynamicLoaderService {
    private users: any[] = [{
        id: uuid.v4(),
        firstName: 'Peter',
        lastName: 'Dark'
    }];
    saveUser(user) {
        return new Promise((resolve, reject) => {
            if (user.id) {
                let entity = this.users.find(e => e.id === user.id);
                if (entity) {
                    entity.firstName = user.firstName;
                    entity.lastName = user.lastName;
                    resolve(entity);
                } else {
                    this.users.push({
                        id: uuid.v4(),
                        firstName: user.firstName,
                        lastName: user.lastName
                    });
                    resolve(this.users[this.users.length - 1]);
                }
            } else {
                this.users.push({
                    id: uuid.v4(),
                    firstName: user.firstName,
                    lastName: user.lastName
                });
                resolve(this.users[this.users.length - 1]);
            }
        });
    }

    getUsers() {
        return new Promise((resolve, reject) => {
            resolve(this.users);
        });
    }
}