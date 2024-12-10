<template>
  <v-card class="mb-4">
    <v-card-title class="d-flex align-center">
      Generated Code
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        variant="text"
        @click="copyCode"
        :disabled="!generatedCode"
      >
        <v-icon start>mdi-content-copy</v-icon>
        Copy Code
      </v-btn>
      <v-btn
        color="primary"
        variant="text"
        @click="downloadCode"
        :disabled="!generatedCode"
      >
        <v-icon start>mdi-download</v-icon>
        Download
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12">
          <!-- Code Editor -->
          <v-textarea
            v-model="generatedCode"
            readonly
            :rows="20"
            class="code-editor"
            :class="{ 'has-code': !!generatedCode }"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      :timeout="3000"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  mappings: {
    type: Array,
    required: true
  },
  tableSchema: {
    type: Array,
    required: true
  },
  requestJson: {
    type: Object,
    required: true
  },
  argumentsJson: {
    type: Object,
    required: true
  }
})

// State
const generatedCode = ref('')
const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// Methods
const generateCode = () => {
  const code = `// Generated Mapping Code
const mapRequestToSchema = (request, args) => {
  return {
${props.mappings.map(mapping => {
    const transformation = mapping.transformation === 'Direct'
      ? `request.${mapping.sourceField}`
      : `transform${mapping.transformation}(request.${mapping.sourceField})`
    return `    ${mapping.targetField}: ${transformation}`
  }).join(',\n')}
  }
}

// Transformation Functions
${generateTransformationFunctions()}

// Example Usage
const mappedData = mapRequestToSchema(request, args)
`

  generatedCode.value = code
}

const generateTransformationFunctions = () => {
  const transformations = new Set(props.mappings.map(m => m.transformation))
  const functions = []

  transformations.forEach(transformation => {
    switch (transformation) {
      case 'ToString':
        functions.push(`const transformToString = (value) => String(value)`)
        break
      case 'ToNumber':
        functions.push(`const transformToNumber = (value) => Number(value)`)
        break
      case 'ToBoolean':
        functions.push(`const transformToBoolean = (value) => Boolean(value)`)
        break
      case 'ToDate':
        functions.push(`const transformToDate = (value) => new Date(value)`)
        break
    }
  })

  return functions.join('\n')
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(generatedCode.value)
    showSnackbar.value = true
    snackbarText.value = 'Code copied to clipboard!'
    snackbarColor.value = 'success'
  } catch (error) {
    showSnackbar.value = true
    snackbarText.value = 'Failed to copy code'
    snackbarColor.value = 'error'
  }
}

const downloadCode = () => {
  const blob = new Blob([generatedCode.value], { type: 'text/javascript' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'generated-mapping.js'
  a.click()
  window.URL.revokeObjectURL(url)
  
  showSnackbar.value = true
  snackbarText.value = 'Code downloaded successfully!'
  snackbarColor.value = 'success'
}

// Watch for changes in props
watch([() => props.mappings, () => props.tableSchema], () => {
  generateCode()
})

// Generate initial code
onMounted(() => {
  generateCode()
})
</script>

<style scoped>
.code-editor {
  font-family: 'Fira Code', monospace;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 1rem;
}

.code-editor.has-code {
  white-space: pre;
  overflow-x: auto;
}
</style>