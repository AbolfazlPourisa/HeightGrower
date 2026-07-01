import { UserInfo } from "../user/user"

export interface Bet 
{
    starter: UserInfo;
    accepter?: UserInfo;
    amount: number;
}