export const ApplicationException = (
    { 
        message = "Error", 
        options = {
            cause:{status: 500}
        }
    }) => {
    throw new Error(message, options)
}
export const BadReaquestException = (
    { 
        message = "Bad Request", 
        issues
    }) => {
    return ApplicationException({
        message,
        options : {
            cause:{status: 400 , issues}
        }
    })
}

export const ConflictException = ({message = "Conflict" , issues})=>{
    return ApplicationException({
        message,
        options : {
            cause:{status: 409 , issues}
        }
    })

}
export const NotFoundException = ({message = "Not Found" , issues})=>{
    return ApplicationException({
        message,
        options : {
            cause:{status: 404 , issues}
        }
    })

}
export const UnauthorizedException = ({message = "Unauthorized" , issues})=>{
    return ApplicationException({
        message,
        options : {
            cause:{status: 401 , issues}
        }
    })

}
export const ForbiddenException = ({message = "Forbidden" , issues})=>{
    return ApplicationException({
        message,
        options : {
            cause:{status: 403 , issues}
        }
    })
}










