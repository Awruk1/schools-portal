export const onRequest = async (context, next) => {
  if (context.locals.runtime && context.locals.runtime.env) {
    context.locals.env = context.locals.runtime.env;
  }
  return next();
};