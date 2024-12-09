<template>
  <v-container fluid class="fill-height login-container">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 login-card">
          <div class="text-center pt-4">
            <img src="../assets/logo/iorta-logo.png" alt="Iorta Logo" class="login-logo" />
          </div>
          
          <v-card-text>
            <h1 class="text-h5 text-center mb-4">Welcome Back</h1>
            <v-form @submit.prevent="handleLogin" ref="form">
              <v-text-field
                v-model="credentials.username"
                label="Email"
                prepend-inner-icon="mdi-email"
                type="email"
                variant="outlined"
                :rules="[rules.required, rules.email]"
                required
                class="mb-2"
              ></v-text-field>

              <v-text-field
                v-model="credentials.password"
                label="Password"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="showPassword = !showPassword"
                :rules="[rules.required]"
                required
                class="mb-4"
              ></v-text-field>

              <div class="d-flex align-center mb-4">
                <v-checkbox
                  v-model="rememberMe"
                  label="Remember me"
                  hide-details
                  class="mr-auto"
                ></v-checkbox>
                <v-btn
                  variant="text"
                  color="primary"
                  class="px-0"
                  density="comfortable"
                >
                  Forgot Password?
                </v-btn>
              </div>

              <v-btn
                color="primary"
                size="large"
                block
                type="submit"
                :loading="loading"
              >
                Sign In
              </v-btn>
            </v-form>

            <div class="mt-4 text-center">
              <p class="text-caption">Default Credentials:</p>
              <p class="text-caption">Email: {{ authStore.DEFAULT_CREDENTIALS.username }}</p>
              <p class="text-caption">Password: {{ authStore.DEFAULT_CREDENTIALS.password }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="showError"
      color="error"
      timeout="3000"
      location="top"
    >
      Invalid email or password
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref(null)
const loading = ref(false)
const showPassword = ref(false)
const showError = ref(false)
const rememberMe = ref(false)

const credentials = ref({
  username: '',
  password: ''
})

const rules = {
  required: v => !!v || 'This field is required',
  email: v => /.+@.+\..+/.test(v) || 'Please enter a valid email'
}

const handleLogin = async () => {
  const { valid } = await form.value.validate()
  
  if (!valid) return

  loading.value = true
  const success = await authStore.login(credentials.value)
  
  if (success) {
    router.push('/')
  } else {
    showError.value = true
  }
  
  loading.value = false
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-card {
  border-radius: 16px;
  padding: 1rem;
}

.login-logo {
  width: 120px;
  height: auto;
  margin-bottom: 1rem;
}

:deep(.v-field) {
  border-radius: 8px !important;
}

:deep(.v-btn) {
  text-transform: none;
  letter-spacing: 0.5px;
  font-weight: 500;
  border-radius: 8px;
}
</style>