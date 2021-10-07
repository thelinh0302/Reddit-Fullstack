import { User } from "../entities/user";
import {Arg, Ctx, Mutation , Resolver } from "type-graphql";
import  argon2d  from "argon2";
import { UserMutationResponse } from "../types/UserMutationResponse";
import { RegisterInput } from "../types/RegisterInput";
import { validateRegisterInput } from "../utils/validateRegisterInput";
import { LoginInput } from "../types/LoginInput";
import { Context } from "../types/Context";
import { COOKIE_NAME } from "../constants";

@Resolver()
export class UserResolver {
    @Mutation(_returns => UserMutationResponse, { nullable: true })
    async register(
        @Arg('registerInput') registerInput: RegisterInput,
        @Ctx(){req} :Context
    ): Promise<UserMutationResponse> {
        const validateRegisterInputErrors = validateRegisterInput(registerInput)
        if (validateRegisterInputErrors !== null)
            return {
                code: 400,
                success: false,
                ...validateRegisterInputErrors
            }
        try {
            const {username,email,password} = registerInput
            const exitstingUser = await User.findOne({
                where:[{username},{email}]
            })
            if (exitstingUser) return {
                code: 400,
                success: false,
                message: 'Duplicated username or email',
                errors: [
                    {
                        field: exitstingUser.username === username ? 'username' : 'email',
                        message: `${exitstingUser.username === username ? 'Username': 'Email'} already taken `
                    }
                ]
        }

        const hashedPassword = await argon2d.hash(password)
        
        let newUser = User.create({
            username,
            email,
            password: hashedPassword
        })
            newUser = await User.save(newUser) 
            req.session.userId = newUser.id
            return {
                code: 200,
                success: true,
                message: 'User registration successful',
                user: newUser
            }
        } catch (error) {
            return {
                code: 500,
                success: false,
                message: `Internal server error ${error.message}`,
            }
        }
    }

    @Mutation(_return => UserMutationResponse)
    async login(
        @Arg('loginInput') { usernameOrEmail, password }: LoginInput,
        @Ctx(){req}:Context
    ): Promise<UserMutationResponse>
    {
        try {

            const exitstingUser = await User.findOne(
                usernameOrEmail.includes('@') ?
                { email: usernameOrEmail } :
                { username: usernameOrEmail })
            if (!exitstingUser)
                return {
                code: 400,
                success: false,
                message: 'User not found',
                errors: [
                        {
                            field: 'usernameOrEmail',
                            message: 'username or email incorrect'
                        }
                    ]
                }
            const passwordValid = await argon2d.verify(exitstingUser.password, password)
            if (!passwordValid)
                return {
                    code: 400,
                    success: false,
                    message: 'Wrong password',
                    errors: [{
                        field: 'password',
                        message: 'Password wrong'
                    }]
                }
            // session: userId
            
             req.session.userId = exitstingUser.id

            return {
                code: 200,
                success: true,
                message: 'Login in successfully',
                user: exitstingUser
            }
        } catch (error) {
            return {
                code: 500,
                success: false,
                message: `Internal server error ${error.message}`,
            }
        }
    }

    @Mutation(_returns => Boolean)
    logout(@Ctx() { req, res }: Context): Promise<boolean>{
        return new Promise((resolve, _reject) => {
            res.clearCookie(COOKIE_NAME)
            req.session.destroy(error => {
                if (error) {
                    console.log('Destroying session error', error)
                    resolve(false)
                }
                resolve(true)
            })  
        })
    }
}