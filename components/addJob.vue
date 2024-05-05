<!-- components/Form.vue -->
<template>
  <form class="flex flex-col gap-2" @submit.prevent="handleFormSubmit">
    <h2>Form</h2>
    <div>
      <label for="title">Title:</label>
      <UInput type="text" id="title" v-model="form.title" />
    </div>
    <div>
      <label for="description">Description:</label>
      <UTextarea id="description" v-model="form.description"></UTextarea>
    </div>
    <div>
      <label for="companyName">Company name:</label>
      <UInput id="companyName" v-model="form.companyName"></UInput>
    </div>
    <div>
      <label for="image">Image:</label>
      <UInput type="file" id="image" @change="handleImageChange" />
    </div>
    <div>
      <label for="logo">Logo:</label>
      <UInput type="file" id="logo" @change="handleLogoChange" />
    </div>
    <UButton type="submit">Submit</UButton>
  </form>
</template>

<script>
export default {
  name: "AddJob",
  data() {
    return {
      form: {
        title: "",
        description: "",
        image: "",
        logo: "",
        companyName: "",
      },
    };
  },

  methods: {
    async handleFormSubmit() {
      console.log(this.form);
      const formData = new FormData();
      formData.append("title", this.form.title);
      formData.append("description", this.form.description);
      formData.append("companyName", this.form.companyName);
      if (this.form.image) {
        formData.append("image", this.form.image, this.form.image.name);
      }

      if (this.form.logo) {
        formData.append("logo", this.form.logo, this.form.logo.name);
      }

      try {
        await axios.post("http://localhost:3001/api/job-offers", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.$emit("close-modal");
      } catch (error) {
        console.error(error);
      }
    },
    handleImageChange(event) {
      this.form.image = event[0];
    },
    handleLogoChange(event) {
      this.form.logo = event[0];
    },
  },
};
</script>
