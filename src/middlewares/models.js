const validateData = (schema, type) => async(req, res, next) => {
  try {
    const getType = {
      payload: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
      file: req.files
    };

    const options = { language: { key: '{{key}} ' } };
    const data = getType[type];

    const isValid = await schema.validate(data, options);
    if (isValid.error) {
      console.log("Failed to validate request parameters")
     const { message } = isValid.error.details[0];

      return res.status(422).json({
      message: message.replace(/["]/g, '')
        
}); 

    }

    console.log("Successfully validated request parameters"); 
    return next();

  }catch (error) {
    return next(error);
  }
};

export default validateData;