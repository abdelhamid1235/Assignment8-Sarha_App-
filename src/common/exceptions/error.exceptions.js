export const ApplicationException = (
    { 
        message = "Error", 
        options = {
            cause:{status: 400}
        }
    }) => {
    throw new Error(message, options)
}

export const ConflictException = ({message = "Conflict" , extra})=>{
    return ApplicationException({
        message,
        options : {
            cause:{status: 409} , ...extra
        }
    })

}
export const NotFoundException = ({message = "Not Found" , extra})=>{
    return ApplicationException({
        message,
        options : {
            cause:{status: 404} , ...extra
        }
    })

}
export const UnauthorizedException = ({message = "Unauthorized" , extra})=>{
    return ApplicationException({
        message,
        options : {
            cause:{status: 401} , ...extra
        }
    })

}
export const ForbiddenException = ({message = "Forbidden" , extra})=>{
    return ApplicationException({
        message,
        options : {
            cause:{status: 403} , ...extra
        }
    })
}










