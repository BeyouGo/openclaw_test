<template>
  <form class="form" @submit.prevent="handleSubmit">
    <h2>Connexion</h2>
    <label>
      Email
      <input v-model="email" type="email" placeholder="mehdi@example.com" required />
    </label>

    <label>
      Mot de passe
      <input v-model="password" type="password" placeholder="••••••••" required />
    </label>

    <button type="submit" :disabled="loading">
      {{ loading ? "Connexion..." : "Se connecter" }}
    </button>

    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{ (event: "authenticated", token: string): void }>();

const email = ref("sauvage.mehdi95@gmail.com");
const password = ref("");
const error = ref("");
const loading = ref(false);

const handleSubmit = async () => {
  error.value = "";
  loading.value = true;
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    if (!response.ok) {
      throw new Error("Identifiants invalides");
    }

    const data = await response.json();
    emit("authenticated", data.token);
    password.value = "";
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Erreur inconnue";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(15, 23, 42, 0.8);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.95rem;
}

input {
  background: #1e293b;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: #f8fafc;
}

button {
  background: linear-gradient(120deg, #2563eb, #7c3aed);
  color: white;
  padding: 0.9rem 1.4rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #f87171;
}
</style>
