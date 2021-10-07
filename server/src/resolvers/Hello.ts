import { Context } from "..//types/Context";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResovlver{
    @Query(_returns=>String)
    hello(
        @Ctx(){req}:Context
    ) {
        console.log(req.session.userId)
        return 'hello world'
    }
}