<template>
  <div class="flex flex-1 max-h-screen w-max-screen">
    <NavBar />
    <div class="flex flex-col flex-1 h-full">
      <div class="flex justify-start">
        <form
          @submit.prevent="searchJobOffers"
          class="flex gap-2 w-full p-4 justify-center"
        >
          <UInput
            v-model="search"
            type="text"
            placeholder="Search"
            class="rounded-md"
          />
          <UButton type="submit">Search</UButton>
        </form>
      </div>

      <div class="p-4">
        <div class="flex justify-between w-full">
          <h1>Job Offers</h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            @click="isOpen = true"
          >
            <path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
          </svg>
          <UModal v-model="isOpen" @close-modal="closeModal">
            <div class="p-4">
              <AddJob isOpen="isOpen" />
            </div>
          </UModal>
        </div>

        <UTable
          class="max-w-screen overflow-scroll"
          :columns="columns"
          :rows="jobOffers"
        />
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "~/components/navBar.vue";
import { api } from "~/utils/api";

export default {
  name: "Admin",
  components: {
    NavBar,
  },
  data() {
    return {
      user: null,
      search: "",
      isOpen: false,
      formData: {
        title: "",
        description: "",
        companyName: "",
      },
      jobOffers: {
        type: Array,
        default: () => [],
      },
      columns: [
        {
          label: "Title",
          key: "title",
        },
        {
          label: "Description",
          key: "description",
        },
        {
          label: "Company Name",
          key: "companyName",
        },
      ],
    };
  },
  mounted() {
    if (!localStorage.getItem("token")) {
      this.$router.push("/login");
    } else {
      this.getJobOffers();
    }
  },
  methods: {
    closeModal() {
      console.log("Close modal");
      this.isOpen = false;
    },

    uploadLogo(event) {
      console.log("Event:", event.target.files[0]);
      // ref logo
      this.$refs.logo.files = event.target.files;
    },

    uploadImage(event) {
      // ref image
      this.$refs.image.files = event.target.files;
    },

    async submitForm() {
      console.log("Form data:", this.$refs.logo);
      console.log("Form data:", this.$refs.image);

      try {
        const formData = new FormData();
        formData.append("title", this.formData.title);
        formData.append("description", this.formData.description);
        formData.append("companyName", this.formData.companyName);
        formData.append("logo", this.$refs.logo.files[0]);
        formData.append("image", this.$refs.image.files[0]);

        console.log("Form data:", formData);
        const response = await api("/job-offers", "POST", formData);
        console.log("New job offer created:", response.data);
      } catch (error) {
        console.error("Error creating job offer:", error);
      }
    },

    async getJobOffers() {
      const res = await api("/job-offers", "GET");
      this.jobOffers = res.data;
    },

    async searchJobOffers(e) {
      const res = await api("/job-offers", "GET", null, {
        search: this.search,
      });
      console.log("Search results:", res.data);
      this.jobOffers = res.data;
    },
  },
};
</script>
