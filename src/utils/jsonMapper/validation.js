export const validateJson = (jsonString) => {
  try {
    JSON.parse(jsonString)
    return { isValid: true, error: null }
  } catch (error) {
    return { isValid: false, error: error.message }
  }
}

export const validateMapping = (mapping) => {
  const errors = []

  if (!mapping.sourceField) {
    errors.push('Source field is required')
  }

  if (!mapping.targetField) {
    errors.push('Target field is required')
  }

  if (!mapping.transformation) {
    errors.push('Transformation type is required')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateFieldTypes = (sourceField, targetField, transformation) => {
  const sourceType = typeof sourceField
  const targetType = targetField.type

  // Direct mapping type validation
  if (transformation === 'Direct') {
    if (sourceType === targetType) {
      return { isValid: true }
    }
    return {
      isValid: false,
      error: `Type mismatch: ${sourceType} cannot be directly mapped to ${targetType}`
    }
  }

  // Transformation validation
  const validTransformations = {
    string: ['ToString', 'ToUpper', 'ToLower'],
    number: ['ToNumber'],
    boolean: ['ToBoolean'],
    date: ['ToDate']
  }

  if (validTransformations[targetType]?.includes(transformation)) {
    return { isValid: true }
  }

  return {
    isValid: false,
    error: `Invalid transformation: ${transformation} cannot convert ${sourceType} to ${targetType}`
  }
}