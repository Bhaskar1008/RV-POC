export const transformationTypes = {
  DIRECT: 'Direct',
  TO_STRING: 'ToString',
  TO_NUMBER: 'ToNumber',
  TO_BOOLEAN: 'ToBoolean',
  TO_DATE: 'ToDate',
  TO_UPPER: 'ToUpper',
  TO_LOWER: 'ToLower',
  CUSTOM: 'Custom'
}

export const transformationFunctions = {
  [transformationTypes.TO_STRING]: (value) => String(value),
  [transformationTypes.TO_NUMBER]: (value) => Number(value),
  [transformationTypes.TO_BOOLEAN]: (value) => Boolean(value),
  [transformationTypes.TO_DATE]: (value) => new Date(value),
  [transformationTypes.TO_UPPER]: (value) => String(value).toUpperCase(),
  [transformationTypes.TO_LOWER]: (value) => String(value).toLowerCase()
}

export const generateTransformationCode = (transformation, fieldName) => {
  switch (transformation) {
    case transformationTypes.DIRECT:
      return `request.${fieldName}`
    case transformationTypes.TO_STRING:
      return `String(request.${fieldName})`
    case transformationTypes.TO_NUMBER:
      return `Number(request.${fieldName})`
    case transformationTypes.TO_BOOLEAN:
      return `Boolean(request.${fieldName})`
    case transformationTypes.TO_DATE:
      return `new Date(request.${fieldName})`
    case transformationTypes.TO_UPPER:
      return `String(request.${fieldName}).toUpperCase()`
    case transformationTypes.TO_LOWER:
      return `String(request.${fieldName}).toLowerCase()`
    case transformationTypes.CUSTOM:
      return `customTransform(request.${fieldName})`
    default:
      return `request.${fieldName}`
  }
}