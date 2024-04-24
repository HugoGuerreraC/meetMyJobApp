<template>
  <div class="h-full w-full flex justify-center items-center">
    <div
      class="flex flex-col items-center border rounded-md gap-2 h-[250px] w-[300px]"
    >
      <h1 class="">Login</h1>
      <form @submit.prevent="login" class="flex justify-center flex-col gap-2">
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
  methods: {
    async login(e) {
      try {
        e.preventDefault();
        const response = await api("/auth/login", "POST", {
          email: this.email,
          password: this.password,
        });

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          this.$router.push("/admin");
        } else {
          console.log(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
