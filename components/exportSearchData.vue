<template>
  <div @click="downloadFile" class="cursor-pointer">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="2em"
      height="2em"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M12 15.575q-.2 0-.375-.062T11.3 15.3l-3.6-3.6q-.3-.3-.288-.7t.288-.7q.3-.3.713-.312t.712.287L11 12.15V5q0-.425.288-.712T12 4t.713.288T13 5v7.15l1.875-1.875q.3-.3.713-.288t.712.313q.275.3.288.7t-.288.7l-3.6 3.6q-.15.15-.325.213t-.375.062M6 20q-.825 0-1.412-.587T4 18v-2q0-.425.288-.712T5 15t.713.288T6 16v2h12v-2q0-.425.288-.712T19 15t.713.288T20 16v2q0 .825-.587 1.413T18 20z"
      ></path>
    </svg>
  </div>
</template>

<script>
export default {
  name: "ExportSearchData",
  props: {
    search: {
      type: String,
    },
  },

  methods: {
    downloadFile() {
      console.log(this.search);
      const jsCode = `
      const apiUrl = 'http://localhost:3001/api/job-offers?search=${this.search}';

    fetch(apiUrl)
      .then(response => {
      return response.json();
      })
      .then(data => {
        const divGeneral = document.createElement('div');

        const divTitre = document.createElement('h2');
        divTitre.textContent = "Résultats de l'API";

        divGeneral.appendChild(divTitre);

        const ul = document.createElement('ul');

        data.forEach(resultat => {
          const image = document.createElement("img");
          const logo = document.createElement("img");
          const title = document.createElement("h1");
          const description = document.createElement("p");
          const companyName = document.createElement("h2");

          image.src = resultat.imageUrl;
          logo.src = resultat.logoUrl;
          title.textContent = resultat.title;
          description.textContent = resultat.description;
          companyName.textContent = resultat.companyName;
          
          ul.appendChild(image);
          ul.appendChild(logo);
          ul.appendChild(title);
          ul.appendChild(description);
          ul.appendChild(companyName);
        });

        divGeneral.appendChild(ul);

        document.body.appendChild(divGeneral);
      })
      .catch(error => {
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

    async downloadFilter() {
      console.log(this.search);
      const res = await api("/job-offers", "GET", null, {
        search: this.search,
      });
      const jobOffers = res.data;

      const jobOfferListElement = document.createElement("div");
      jobOfferListElement.id = "job-offer-list";

      jobOffers.forEach((jobOffer) => {
        const jobOfferElement = document.createElement("div");
        jobOfferElement.className =
          "max-h-[200px] flex w-full bg-white rounded-md hover:shadow-xl cursor-pointer transition duration-300 ease-in-out";

        const imageElement = document.createElement("img");
        imageElement.src = jobOffer.imageUrl;
        imageElement.alt = "Logo";
        imageElement.className = "w-[293px] h-[200px] object-cover rounded-md";

        jobOfferElement.appendChild(imageElement);

        const logoElement = document.createElement("img");
        logoElement.src = jobOffer.logoUrl;
        logoElement.alt = "Logo";
        logoElement.className =
          "object-fit rounded-full w-full h-full absolute translate-y-1/2 left-[253px] z-1";

        const logoContainerElement = document.createElement("div");
        logoContainerElement.appendChild(logoElement);

        jobOfferElement.appendChild(logoContainerElement);

        const detailsElement = document.createElement("div");
        detailsElement.className =
          "flex flex-col pl-[86px] justify-center h-full";

        const companyNameSpan = document.createElement("span");
        companyNameSpan.textContent = jobOffer.companyName;

        const titleH1 = document.createElement("h1");
        titleH1.className = "inline-block text-2xl font-bold pb-4";
        titleH1.textContent = jobOffer.title;

        const titleSpan = document.createElement("span");
        titleSpan.className = "block mt-[-13px] h-2 bg-[#77e9cb] rounded-full";

        titleH1.appendChild(titleSpan);

        detailsElement.appendChild(companyNameSpan);
        detailsElement.appendChild(titleH1);

        jobOfferElement.appendChild(detailsElement);

        jobOfferListElement.appendChild(jobOfferElement);
      });
      const jsCode = `
    const jobOffers = ${JSON.stringify(jobOffers)};
    // Add more JavaScript code here if needed
  `;

      // Create a Blob object containing the generated JavaScript code
      const blob = new Blob([jsCode], { type: "text/javascript" });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a link for downloading the file
      const link = document.createElement("a");
      link.href = url;
      link.download = "job-offers.js";
      link.target = "_blank";

      // Add the link to the page and trigger automatic download
      jobOfferListElement.appendChild(link);
      link.click();

      // Clean up after the download
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  },
};
</script>
