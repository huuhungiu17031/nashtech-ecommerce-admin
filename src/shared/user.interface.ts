export interface UserInterface {
    id: number;
    email: string;
    roles: string[];
    action: boolean;
    isBlock: boolean;
}

export interface UserTableInterface extends UserInterface {}
