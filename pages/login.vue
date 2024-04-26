<template>
  <div>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="login">
        <UInput v-model="email" type="text" placeholder="Email" />
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
  // create an error state to handle the error

  data() {
    return {
      email: "",
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
          email: this.email,
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
