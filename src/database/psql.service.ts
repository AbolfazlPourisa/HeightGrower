import { Database } from "./database";
import { UserInfo } from "../user/user";
import { Log } from "../log/log";
import { Pool } from "pg";

const ThisModulePath = "./src/database/psql.service.ts";

export class PsqlDB implements Database 
{
    private pool: Pool;

    constructor(
        host: string,
        port: number,
        database: string,
        user: string,
        password: string,
        maxConnections: number = 30,
        idleTimeoutMillis: number = 30000
    ) 
    {
        this.pool = new Pool({
            host,
            port,
            database,
            user,
            password,
            max: maxConnections,
            idleTimeoutMillis: idleTimeoutMillis
        });

        Log.log(
            `Database pool initialized with 
                host: ${host} 
                port: ${port}
                database: ${database}
                user: ${user}
                password: ***
                max: ${maxConnections}
                idleTimeoutMillis: ${idleTimeoutMillis}ms
            properties
            log from ${ThisModulePath}`,
            false
        );
    }

    public async checkUserExists(
        user: UserInfo
    ): Promise<boolean> 
    {
        try 
        {
            const isUserExists = await this.pool.query(
                `SELECT EXISTS(
                    SELECT 1 FROM users WHERE id = $1
                )`,
                [
                    user.id
                ]
            );

            Log.log(
                `checkUserExists method executed successfully, log from ${ThisModulePath}`,
                false
            );

            return isUserExists.rows[0].exists;     
        } catch(
            error
        )
        {
            Log.log(
                `Unable to executed checkUserExists method, log from ${ThisModulePath}`,
                true
            );

            throw error;
        }
    }

    public async connect(): Promise<void> 
    {
        try 
        {
            await this.pool.connect();
            
            Log.log(
                `Connected to database successfully, log from ${ThisModulePath}`,
                false
            );

        } catch (
            error
        ) 
        {
            Log.log(
                `Unable to connect database, log from ${ThisModulePath}`,
                true
            );

            throw error;
        }
    }

    public async createTables(): Promise<void> 
    {
        const queries = 
        [
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

        for (let i = 0; i < queries.length; i++) 
        {
            const query = queries[i];

            try {
                await this.pool.query(query);
                
                Log.log(
                    `Query table number ${i + 1} executed successfully, log from ${ThisModulePath}`,
                    false
                );
            } catch (
                error
            ) {
                Log.log(
                    `Unable to executed table query number ${i + 1}, log from ${ThisModulePath}`,
                    true
                );

                throw error;
            }
        }
    }

    public async addUser(
        user: UserInfo
    ) 
    {
        try 
        {
            const isUserExists = await this.checkUserExists(
                user
            
            );

            Log.log(
                `checkUserExists executed successfully from addUser, log from ${ThisModulePath}`,
                false
            );

            if (
                isUserExists
            ) return;
        } catch(
            error
        )
        {
            Log.log(
                `Unable to addUser because checkUserExists failed, log from ${ThisModulePath}`,
                true
            );

            throw error;
        }

        try 
        {
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

            Log.log(
                `addUser executed successfully, log from ${ThisModulePath}`,
                false
            );
        } catch (
            error
        ) 
        {
            Log.log(
                `Unable to addUser, log from ${ThisModulePath}`,
                true
            );

            throw error;
        }
    }

    public async createBet(
        starter: UserInfo,
        amount: string
    ): Promise<void> 
    {
        const amountNumber = Number(
            amount
        );

        try 
        {
            await this.pool.query(
                `INSERT INTO bets (
                    starter,
                    amount
                ) VALUES (
                    $1,
                    $2
                )`,
                [
                    starter.id,
                    amountNumber
                ]
            );
            
            Log.log(
                `createBet executed successfully, log from ${ThisModulePath}`,
                false
            );
        } catch (
            error
        ) 
        {
            Log.log(
                `Unable to createBet, log from ${ThisModulePath}`,
                true
            );

            throw error;
        }
    }
}