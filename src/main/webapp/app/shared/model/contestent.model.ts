import { IUser } from 'app/core/user/user.model';

export interface IContestent {
    id?: number;
    name?: string;
    avatar?: string;
    description?: string;
    video?: string;
    abandoned?: boolean;
    tutor?: IUser;
    chosens?: IUser[];
}

export class Contestent implements IContestent {
    constructor(
        public id?: number,
        public name?: string,
        public avatar?: string,
        public description?: string,
        public video?: string,
        public abandoned?: boolean,
        public tutor?: IUser,
        public chosens?: IUser[]
    ) {
        this.abandoned = this.abandoned || false;
    }
}
