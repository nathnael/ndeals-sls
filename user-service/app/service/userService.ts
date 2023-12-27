import { UserRepository } from "../repository/userRepository";
import { SuccessResponse } from "../utility/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class UserService {
    repository: UserRepository;
    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    async CreateUser(event: APIGatewayProxyEventV2) {
        const body = event.body;
        console.log(body);

        await this.repository.CreateUserOperation();
        
        return SuccessResponse({ message: "response from create user"});
    }

    async UserLogin(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: "response from user login"});
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