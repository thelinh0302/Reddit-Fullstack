import { FieldError } from "../generated/graphql";

export const mapFieldErrors = (error: FieldError[]) => {
    return error.reduce((arrError, error) => ({
        ...arrError,
        [error.field] :error.message
    }),
        {}
    )
}