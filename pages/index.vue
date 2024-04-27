<template>
  <div class="flex gap-4 h-full w-full flex-col items-start p-4">
    <div class="flex w-full justify-center">
      <UInput
        v-on:input="delayedSearch"
        v-model="search"
        type="text"
        placeholder="Rechercher une offre"
      />
    </div>
    <h1 class="inline-block text-2xl font-bold pb-4">
      Découvrez les offres qui vous correspondent
      <span class="block mt-[-13px] h-2 bg-[#77e9cb] rounded-full"></span>
    </h1>
    <div
      v-for="jobOffer in jobOffers"
      :key="jobOffer.id"
      class="max-h-[200px] flex w-full bg-white rounded-md hover:shadow-xl cursor-pointer transition duration-300 ease-in-out"
    >
      <div class="flex justify-start w-full shadow-lg rounded-md">
        <nuxt-img
          class="w-[293px] h-[200px] object-cover rounded-md"
          :src="jobOffer.imageUrl"
          alt="Logo"
        />
        <div
          class="rounded-full shadow-xl h-[100px] absolute translate-y-1/2 left-[253px] w-[100px] z-1"
        >
          <nuxt-img
            class="object-fit rounded-full w-full h-full"
            :src="jobOffer.logoUrl"
            alt="Logo"
          />
        </div>
        <div class="flex flex-col pl-[86px] justify-center h-full">
          <span>
            {{ jobOffer.companyName }}
          </span>
          <h1 class="inline-block text-2xl font-bold pb-4">
            {{ jobOffer.title }}
            <span class="block mt-[-13px] h-2 bg-[#77e9cb] rounded-full"></span>
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "~/utils/api";

export default {
  name: "Index",
  data() {
    return {
      jobOffers: [],
      search: "",
    };
  },

  async mounted() {
    await this.getJobOffers();
  },
  methods: {
    async delayedSearch() {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(async () => {
        await this.searchJobOffers();
      }, 300);
    },
    async getJobOffers(e) {
      try {
        const response = await api("/job-offers", "GET");
        this.jobOffers = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async searchJobOffers(e) {
      const res = await api("/job-offers", "GET", null, {
        search: this.search,
      });
      this.jobOffers = res.data;
    },
  },
};
</script>
