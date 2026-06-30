import { Database } from "./database";
import { UserInfo } from "../user/user";
import { Pool } from "pg";

export class PsqlDB implements Database {
    private pool: Pool;

    constructor(
        host: string,
        port: number,
        database: string,
        user: string,
        password: string
    ) {
        this.pool = new Pool({
            host,
            port,
            database,
            user,
            password
        });
    }

    public async checkUserExsits(
        user: UserInfo
    ): Promise<boolean> {
        try {
            const isUserExists = await this.pool.query(
                `SELECT EXISTS(
                    SELECT 1 FROM users WHERE id = $1
                )`,
                [
                    user.id
                ]
            );

            return isUserExists.rows[0].exists;     
        } catch(
            error
        ) {
            console.error(
                "Unable to checkUserExsits"
            );
            throw error;
        }
    }

    public async connect(): Promise<void> {
        try {
            await this.pool.connect();
            console.log(
                "Connected to database successfuly"
            );
        } catch (
            error
        ) {
            console.error(
                "Unable to connect database"
            );
            throw error;
        }
    }

    public async createTables(): Promise<void> {
        const queries = [
            `CREATE TABLE IF NOT EXISTS users (
                id TEXT UNIQUE PRIMARY KEY,
                username VARCHAR(255),
                name VARCHAR(255),
                height BIGINT DEFAULT 0,
                last_grown TIMESTAMP DEFAULT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )`,
            
            `CREATE TABLE IF NOT EXISTS users_at_groups (
                group_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                PRIMARY KEY (group_id, user_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )`,

            `CREATE TABLE IF NOT EXISTS bets (
                id SERIAL PRIMARY KEY,
                starter TEXT NOT NULL,
                accepter TEXT DEFAULT NULL,
                amount BIGINT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                FOREIGN KEY (starter) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (accepter) REFERENCES users(id) ON DELETE SET NULL
            )`
        ];

        for (const [query, index] of queries) {
            try {
                await this.pool.query(query);
            } catch (
                error
            ) {
                console.error(
                    `An error while executing table query number ${index + 1}`
                );
                throw error;
            }
        }
    }

    public async addUser(
        user: UserInfo
    ) {
        if (
            await this.checkUserExsits(
                user
            )
        ) return;

        try {
            await this.pool.query(
                `INSERT INTO users (
                    id,
                    username,
                    name
                )
                VALUES (
                    $1,
                    $2,
                    $3
                )`,
                [
                    user.id,
                    user.username || null,
                    user.name || null
                ]
            );
        } catch (
            error
        ) {
            console.error(
                "Unable to addUser"
            );
            throw error;
        }
    }

    public async createBet(
        starter: UserInfo,
        amount: string
    ): Promise<void> {
        const amountNumber = Number(
            amount
        );

        this.pool.query(
            `INSERT INTO bets (
                starter,
                accepter,
                amount
            ) VALUES (
                $1,
                $2,
                $3 
            )`,
            [
                
            ]
        );
    }
}