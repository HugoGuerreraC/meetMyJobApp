<template>
  <div>
    <h1>Admin</h1>
    <p>Welcome to the admin page</p>
    <p v-if="user">Logged in as: {{ user.email }}</p>
  </div>
</template>

<script>
import { api } from "~/utils/api";

export default {
  name: "admin",
  data() {
    return { user: null };
  },
  mounted() {
    if (!localStorage.getItem("token")) {
      this.$router.push("/login");
    }

    this.getUser();
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },

    async getUser() {
      const { data } = await api("/auth/me", "GET");

      if (data) {
        this.user = data;
      }
    },
  },
};
</script>
