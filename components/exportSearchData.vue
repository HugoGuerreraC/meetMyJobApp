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
  },
};
</script>
