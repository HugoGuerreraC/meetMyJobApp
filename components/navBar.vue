<template>
  <div class="min-w-[90px] min-h-screen border-r border-primary">
    <div class="flex justify-between flex-col h-full items-center py-2">
      <div></div>
      <div>
        <UButton @click="logout">Logout</UButton>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      user: null,
    };
  },

  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>
