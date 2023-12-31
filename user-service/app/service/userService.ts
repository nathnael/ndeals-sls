import { plainToClass } from "class-transformer";
import { UserRepository } from "../repository/userRepository";
import { ErrorResponse, SuccessResponse } from "../utility/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { autoInjectable } from "tsyringe";
import { SignupInput } from "../models/dto/SignupInput";
import { AppValidationError } from "../utility/error";
import { GetSalt, GetHashedPassword, ValidatePassword, GetToken, VerifyToken } from "../utility/password";
import { LoginInput } from "../models/dto/LoginInput";
import { GenerateAccessCode, SendVerificationCode } from "../utility/notification";

@autoInjectable()
export class UserService {
    repository: UserRepository;
    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    async CreateUser(event: APIGatewayProxyEventV2) {
        try {
            const input = plainToClass(SignupInput, event.body);
            const error = await AppValidationError(input);

            if(error) return ErrorResponse(404, error);

            const salt = await GetSalt();
            const hashedPassword = await GetHashedPassword(input.password, salt);
            const data = await this.repository.createAccount({
                email: input.email,
                password: hashedPassword,
                phone: input.phone,
                userType: "BUYER",
                salt: salt,
            });
            
            return SuccessResponse(data);
        } catch (error) {
            console.log(error);
            return ErrorResponse(500, error);
        }        
    }

    async UserLogin(event: APIGatewayProxyEventV2) {
        try {
            const input = plainToClass(LoginInput, event.body);
            const error = await AppValidationError(input);

            if(error) return ErrorResponse(404, error);
            
            const data = await this.repository.findAccount(input.email);
            
            const verified = await ValidatePassword(input.password, data.password,data.salt);

            if(!verified) {
                throw new Error("Password does not match!")
            }

            const token = GetToken(data);

            return SuccessResponse({ token });
        } catch (error) {
            console.log(error);
            return ErrorResponse(500, error);
        }
    }

    async GetVerificationToken(event: APIGatewayProxyEventV2) {
        const token = event.headers.authorization;
        const payload = await VerifyToken(token);
        if(payload) {
            const { code, expiry } = GenerateAccessCode();
            // Save on DB to confirm verification
            const response = await SendVerificationCode(code, payload.phone);

            return SuccessResponse({ 
                message: "Verification code is sent to your registered phone number!"
            });
        }

        
    }

    async VerifyUser(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: "response from verify user"});
    }

    // User Profile

    async CreateProfile(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: "response from create profile"});
    }

    async GetProfile(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: "response from get profile"});
    }

    async EditProfile(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: "response from edit profile"});
    }

    // Cart Section
    
    async CreateCart(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: "response from create cart"});
    }

    async GetCart(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: "response from get cart"});
    }

    async UpdateCart(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: "response from update cart"});
    } 
    
    // Payment Section
    
    async CreatePayment(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: "response from create payment"});
    }

    async GetPayment(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: "response from get payment"});
    }

    async UpdatePayment(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: "response from update payment"});
    } 
}