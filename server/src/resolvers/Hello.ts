import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResovlver{
    @Query(_returns=>String)
    hello() {
        return 'hello world'
    }
}