<template>
  <v-card class="mb-4">
    <v-card-title>Upload JSON Files</v-card-title>
    <v-card-text>
      <v-row>
        <!-- Request JSON Upload -->
        <v-col cols="12" md="6">
          <v-card class="upload-card">
            <v-card-title class="text-subtitle-1">Request JSON</v-card-title>
            <v-card-text>
              <v-file-input
                v-model="requestFile"
                accept=".json"
                label="Upload request.json"
                @change="handleRequestUpload"
                :error-messages="requestError"
                prepend-icon="mdi-code-json"
              ></v-file-input>              
              <v-expand-transition>
                <div v-if="requestPreview" class="mt-4">
                  <div class="text-subtitle-2 mb-2">Preview:</div>
                  <v-card class="preview-card">
                    <pre>{{ requestPreview }}</pre>
                  </v-card>
                </div>
              </v-expand-transition>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Arguments JSON Upload -->
        <v-col cols="12" md="6">
          <v-card class="upload-card">
            <v-card-title class="text-subtitle-1">Arguments JSON</v-card-title>
            <v-card-text>
              <v-file-input
                v-model="argumentsFile"
                accept=".json"
                label="Upload arguments.json"
                @change="handleArgumentsUpload"
                :error-messages="argumentsError"
                prepend-icon="mdi-code-json"
              ></v-file-input>

              <v-expand-transition>
                <div v-if="argumentsPreview" class="mt-4">
                  <div class="text-subtitle-2 mb-2">Preview:</div>
                  <v-card class="preview-card">
                    <pre>{{ argumentsPreview }}</pre>
                  </v-card>
                </div>
              </v-expand-transition>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  requestJson: {
    type: [Object, null],
    default: null
  },
  argumentsJson: {
    type: [Object, null],
    default: null
  }
})

const emit = defineEmits(['update:requestJson', 'update:argumentsJson', 'validation'])

// File inputs
const requestFile = ref(null)
const argumentsFile = ref(null)

// Previews
const requestPreview = ref('')
const argumentsPreview = ref('')

// Error messages
const requestError = ref('')
const argumentsError = ref('')

// Handle file uploads
const handleRequestUpload = async () => {
  console.log("Selected file:", requestFile.value);
  const file = requestFile.value;

  if (!file) {
    requestPreview.value = '';
    requestError.value = 'No file selected.';
    emit('update:requestJson', null);
    return;
  }

  try {
    const content = await readFile(file);
    const parsed = JSON.parse(content);
    requestPreview.value = JSON.stringify(parsed, null, 2);
    requestError.value = '';
    emit('update:requestJson', parsed);
  } catch (error) {
    requestPreview.value = '';
    requestError.value = 'Invalid JSON file: ' + error.message;
    emit('update:requestJson', null);
  }
};

const handleArgumentsUpload = async () => {
  const file = argumentsFile.value;
  if (!file) {
    argumentsPreview.value = ''
    argumentsError.value = ''
    emit('update:argumentsJson', null)
    return
  }

  try {
    const content = await readFile(file)
    const parsed = JSON.parse(content)
    argumentsPreview.value = JSON.stringify(parsed, null, 2)
    argumentsError.value = ''
    emit('update:argumentsJson', parsed)
  } catch (error) {
    argumentsError.value = 'Invalid JSON file'
    emit('update:argumentsJson', null)
  }
}

// Utility function to read file
const readFile = (file) => {
  return new Promise((resolve, reject) => {
    // if (!file || !(file instanceof Blob)) {
    //   reject(new Error("Invalid file type. Expected a Blob or File."));
    //   return;
    // }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file[0]);
  });
};


// Watch for validation
watch([requestFile, argumentsFile], () => {
  emit('validation', !requestError.value && !argumentsError.value)
})
</script>

<style scoped>
.upload-card {
  height: 100%;
}

.preview-card {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.preview-card pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>