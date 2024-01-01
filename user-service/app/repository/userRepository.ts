import { UserModel } from "../models/UserModel";
import { DBClient } from "../utility/databaseClient";
import { DBOperation } from "./dbOperations";

export class UserRepository extends DBOperation {
    constructor() {
        super();
    }

    async createAccount({ email, password, salt, phone, userType }: UserModel) {
        const queryString = "INSERT INTO users(phone,email,password,salt,user_type) VALUES($1,$2,$3,$4,$5) RETURNING *";
        const vlaues = [phone, email, password, salt, userType];
        const result = await this.executeQuery(queryString, vlaues);
        if(result.rowCount > 0) {
            return result.rows[0] as UserModel;
        }
    }

    async findAccount(email: string) {
        const queryString = "SELECT user_id, email, password, phone, salt, verification_code, expiry FROM users WHERE email = $1";
        const values = [email];
        const result = await this.executeQuery(queryString, values);
        if(result.rowCount < 1) {
            throw new Error("User does not exist with the provided email id!");
        }
        return result.rows[0] as UserModel;
    }

    async updateVerificationCode(userId: string, code: number, expiry: Date) {
        const queryString = "UPDATE users SET verification_code=$1, expiry=$2 WHERE user_id=$3 AND verified=FALSE RETURNING *";
        const vlaues = [code, expiry, userId];
        const result = await this.executeQuery(queryString, vlaues);
        if(result.rowCount > 0) {
            return result.rows[0] as UserModel;
        }
        throw new Error("User already verified!");
    }

    async updateVerifyUser(userId: string) {
        const queryString = "UPDATE users SET verified=TRUE WHERE user_id=$1 AND verified=FALSE RETURNING *";
        const vlaues = [userId];
        const result = await this.executeQuery(queryString, vlaues);
        if(result.rowCount > 0) {
            return result.rows[0] as UserModel;
        }
        throw new Error("User already verified!");
    }
}

