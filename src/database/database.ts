import { UserInfo } from "../user/user";

export interface Database 
{
    checkUserExists(
        user: UserInfo
    ): Promise<boolean>;

    connect(): Promise<void>;

    createTables(): Promise<void>;

    addUser(
        user: UserInfo
    ): Promise<void>;

    createBet(
        starter: UserInfo,
        amount: string
    ): Promise<void>;
}