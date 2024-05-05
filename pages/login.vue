<template>
  <div>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="login">
        <UInput v-model="username" type="text" placeholder="Username" />
        <UInput v-model="password" type="password" placeholder="Password" />
        <UButton type="submit">Se connecter</UButton>
      </form>
    </div>
  </div>
</template>

<script>
import { api } from "~/utils/api";

export default {
  name: "login",
  data() {
    return {
      username: "",
      password: "",
    };
  },

  mounted() {
    if (localStorage.getItem("token")) {
      this.$router.push("/admin");
    }
  },

  methods: {
    async login(e) {
      try {
        e.preventDefault();
        const response = await api("/auth/login", "POST", {
          username: this.username,
          password: this.password,
        });
        localStorage.setItem("token", response.data.token);
        this.$router.push("/admin");
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
