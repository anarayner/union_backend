module.exports = class ApiError extends Error{
   status;
   errors;
   
   constructor(status, message, errors = []){
      super(message);
      this.status = status;
      this.errors = errors;
   }

   static UnauthorizedError(){
      return new ApiError(404, 'User not authorized')
   }
   static BadRequest(message, errors=[]){
      return new ApiError(400, message, errors)
   }
   static InvalidPassword(){
      return new ApiError(500, 'Invalid login or password')
   }
}