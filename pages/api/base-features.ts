// import { HandlerOptions, ApiRouteMiddleware, createHandlers, ChainingStrategies } from 'next-middle-api/dist';
import { HandlerOptions, ApiRouteMiddleware, createHandlers } from 'next-middle-api/dist';


// const hook1: ApiRouteMiddleware = async (req, res, context, next) => {
//   throw new Error('some new error');
// };
//
// const hook2: ApiRouteMiddleware = async (req, res, context, next) => {
//   if (!context.hasError) return next();
//   const message = (context.firstError as any).message;
//   res.status(500).json({message: `${message} was found later down stream`});
//   await next();
// };
//
// const opts: HandlerOptions = {
//   errorHandler: async (error, req, res) => res.status(500).json({message: (error as any).message}),
//   chainingStrategy: ChainingStrategies.ContinueButSkipHandlerOnError
// };

export default createHandlers({
  get: {
    handler: async (req, res) => {
      res.status(200).json({message: 'hello'});
    },
    // preHooks: [hook1],
    // postHooks: [hook2]
  }
});
