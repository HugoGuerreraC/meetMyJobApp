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
        <h1>Job Offers</h1>

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
    downloadFile() {
      const jsCode = `
      const apiUrl = 'https://api.exemple.com/data';

// Tableau de titres
const titres = ['Titre 1', 'Titre 2', 'Titre 3'];

// Effectuer une requête GET à l'API
fetch(apiUrl)
  .then(response => {
    // Vérifier si la réponse est OK (200)
    if (!response.ok) {
      throw new Error('Erreur lors de la requête à l\'API');
    }
    // Convertir la réponse en JSON
    return response.json();
  })
  .then(data => {
    // Créer une div générale
    const divGeneral = document.createElement('div');

    // Créer un titre pour la div
    const divTitre = document.createElement('h2');
    divTitre.textContent = "Résultats de l'API";

    // Ajouter le titre à la div générale
    divGeneral.appendChild(divTitre);

    // Créer une liste pour les résultats
    const ul = document.createElement('ul');

    // Parcourir les données et les ajouter à la liste
    titres.forEach(resultat => {
      const li = document.createElement('li');
      li.textContent = resultat;
      ul.appendChild(li);
    });

    // Ajouter la liste à la div générale
    divGeneral.appendChild(ul);

    // Ajouter la div générale au corps du document
    document.body.appendChild(divGeneral);
  })
  .catch(error => {
    // Gérer les erreurs
    console.error('Erreur :', error);
  });
  `;

      // Récupérer le contenu JavaScript généré

      // Création d'un objet Blob contenant le code JavaScript généré
      const blob = new Blob([jsCode], { type: "text/javascript" });

      // Création d'un URL pour le Blob
      const url = URL.createObjectURL(blob);

      // Création d'un lien pour le téléchargement
      const link = document.createElement("a");
      link.href = url;
      link.download = "script.js";

      // Ajout du lien à la page et déclenchement automatique du téléchargement
      document.body.appendChild(link);
      link.click();

      // Nettoyage après le téléchargement
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
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
