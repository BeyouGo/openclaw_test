<template>
  <main class="container">
    <section class="card">
      <header>
        <h1>OpenClaw Portal</h1>
        <p class="subtitle">Espace sécurisé pour Mehdi</p>
      </header>

      <LoginForm v-if="!token" @authenticated="handleAuthenticated" />

      <Dashboard v-else :token="token" @logout="handleLogout" />
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LoginForm from "./components/LoginForm.vue";
import Dashboard from "./components/Dashboard.vue";

const token = ref<string | null>(localStorage.getItem("portal_token"));

const handleAuthenticated = (newToken: string) => {
  token.value = newToken;
  localStorage.setItem("portal_token", newToken);
};

const handleLogout = () => {
  token.value = null;
  localStorage.removeItem("portal_token");
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0b1120;
  padding: 2rem;
  color: #e2e8f0;
}

.card {
  width: min(920px, 100%);
  background: #0f172a;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(2, 6, 23, 0.45);
}

header {
  margin-bottom: 2rem;
}

.subtitle {
  color: #94a3b8;
  margin-top: 0.5rem;
}
</style>
