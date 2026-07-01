import { LogLevel } from "./log.level";
import { config } from "dotenv"

config();

export class Log 
{
    private static getLevel(): LogLevel 
    {
        const level = parseInt(
            process.env.LOG_LEVEL || "3", 10
        );

        return isNaN(level) ? LogLevel.ALL : level;
    }

    private static shouldLog(
        error: boolean
    ): boolean 
    {
        if (
            this.getLevel() === LogLevel.NONE ||
            (
                this.getLevel() === LogLevel.ERRORONLY &&
                !error
            )
        ) return false;

        return true;
    }

    public static log(
        message: string,
        error: boolean
    ) 
    {
        if (
            this.shouldLog(
                error
            )
        ) 
        {
            error ? console.error(
                message
            ) : console.log(
                message
            );
        }
    }
}