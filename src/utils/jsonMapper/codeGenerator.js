import { transformationTypes, generateTransformationCode } from './transformations'

export const generateMappingCode = (mappings, tableName) => {
  const code = `// Generated Mapping Code
const mapRequestToSchema = (request, args) => {
  return {
${generateMappingBody(mappings)}
  }
}

${generateTransformationFunctions(mappings)}

${generateUsageExample(tableName)}
`
  return code
}

const generateMappingBody = (mappings) => {
  return mappings
    .map(mapping => {
      const transformation = generateTransformationCode(
        mapping.transformation,
        mapping.sourceField
      )
      return `    ${mapping.targetField}: ${transformation}`
    })
    .join(',\n')
}

const generateTransformationFunctions = (mappings) => {
  const usedTransformations = new Set(mappings.map(m => m.transformation))
  const functions = []

  if (usedTransformations.has(transformationTypes.CUSTOM)) {
    functions.push(`
const customTransform = (value) => {
  // Add your custom transformation logic here
  return value
}`)
  }

  return functions.join('\n')
}

const generateUsageExample = (tableName) => {
  return `
// Example Usage
const request = {
  // Your request data here
}

const args = {
  // Your arguments here
}

const mappedData = mapRequestToSchema(request, args)
console.log('Mapped data for ${tableName}:', mappedData)
`
}

export const generateTypeDefinitions = (mappings, tableSchema) => {
  const types = `
interface RequestData {
${mappings.map(m => `  ${m.sourceField}: any`).join('\n')}
}

interface MappedData {
${tableSchema.map(field => `  ${field.name}: ${field.type}`).join('\n')}
}

type MapFunction = (request: RequestData, args: any) => MappedData
`
  return types
}