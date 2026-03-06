<template>
  <div class="dashboard">
    <header class="dashboard__header">
      <div>
        <p class="badge">Connecté</p>
        <h2>Bonjour Mehdi 👋</h2>
        <p class="muted">Résumé rapide de nos dernières interactions</p>
      </div>
      <button class="ghost" @click="$emit('logout')">Déconnexion</button>
    </header>

    <section class="grid">
      <article class="panel">
        <h3>Nouvelle note</h3>
        <form class="form" @submit.prevent="submitInteraction">
          <label>
            Titre
            <input v-model="form.title" type="text" required />
          </label>
          <label>
            Description
            <textarea v-model="form.description" rows="4" required></textarea>
          </label>
          <button type="submit" :disabled="submitting">
            {{ submitting ? "Enregistrement..." : "Ajouter" }}
          </button>
        </form>
      </article>

      <article class="panel">
        <header class="panel__header">
          <h3>Historique</h3>
          <button type="button" class="ghost" @click="fetchInteractions">Actualiser</button>
        </header>
        <ul class="list">
          <li v-for="interaction in interactions" :key="interaction.id">
            <strong>{{ interaction.title }}</strong>
            <p>{{ interaction.description }}</p>
            <small>{{ formatDate(interaction.createdAt) }}</small>
          </li>
          <li v-if="!interactions.length" class="empty">Aucune interaction enregistrée.</li>
        </ul>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";

interface Interaction {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

const props = defineProps<{ token: string }>();

const interactions = ref<Interaction[]>([]);
const submitting = ref(false);
const form = reactive({ title: "", description: "" });

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "/api";

const fetchInteractions = async () => {
  const response = await fetch(`${apiBase}/interactions`, {
    headers: { Authorization: `Bearer ${props.token}` },
  });
  if (response.ok) {
    const data = await response.json();
    interactions.value = data.interactions;
  }
};

const submitInteraction = async () => {
  submitting.value = true;
  try {
    await fetch(`${apiBase}/interactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify(form),
    });
    form.title = "";
    form.description = "";
    await fetchInteractions();
  } finally {
    submitting.value = false;
  }
};

const formatDate = (value: string) => new Date(value).toLocaleString();

onMounted(() => {
  void fetchInteractions();
});
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.muted {
  color: #94a3b8;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.panel {
  background: rgba(15, 23, 42, 0.8);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.15);
}

.panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

textarea,
input {
  background: #1e293b;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: #f8fafc;
  padding: 0.75rem 1rem;
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.65rem 1.5rem;
  background: linear-gradient(120deg, #22d3ee, #6366f1);
  color: white;
  font-weight: 600;
  cursor: pointer;
}

button.ghost {
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 360px;
  overflow-y: auto;
}

.list li {
  padding: 1rem;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.list small {
  color: #94a3b8;
}

.empty {
  text-align: center;
  color: #94a3b8;
}
</style>
