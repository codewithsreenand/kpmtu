function renderDistrictList() {
  const container = document.getElementById("district-list");
  if (!container || !window.KPMTU_DATA) return;

  const list = document.createElement("div");
  list.className = "columns";

  (window.KPMTU_DATA.districts || []).forEach((district) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.padding = "0";
    card.style.overflow = "hidden";
    card.style.height = "100%";

    const imgWrapper = document.createElement("div");
    imgWrapper.style.width = "100%";
    imgWrapper.style.height = "180px";
    imgWrapper.style.backgroundColor = "var(--bg-alt)";
    
    const img = document.createElement("img");
    // Prioritize: 1. Gallery first image, 2. District-ID-based image, 3. Logo fallback
    let posterSrc = "assets/images/logo.jpeg";
    if (district.gallery && district.gallery.length > 0) {
      posterSrc = district.gallery[0];
    } else {
      posterSrc = `assets/images/districts/${district.id}.jpg`;
    }

    img.src = posterSrc;
    img.alt = district.name.en;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.loading = "lazy";
    img.onerror = function() {
      if (this.src.indexOf("assets/images/logo.jpeg") === -1) {
        this.src = "assets/images/logo.jpeg";
      }
    };
    imgWrapper.appendChild(img);

    const contentWrapper = document.createElement("div");
    contentWrapper.style.padding = "1.5rem";
    contentWrapper.style.display = "flex";
    contentWrapper.style.flexDirection = "column";
    contentWrapper.style.flex = "1";

    const name = document.createElement("h3");
    name.style.marginBottom = "auto"; // Pushes the link to the bottom
    name.textContent = district.name[document.documentElement.lang] || district.name.en;

    const linkContainer = document.createElement("div");
    linkContainer.style.marginTop = "1.5rem";

    const link = document.createElement("a");
    link.href = `district.html?district=${encodeURIComponent(district.id)}`;
    link.className = "btn btn-outline";
    link.style.fontSize = "0.9rem";
    link.textContent = window.t ? window.t("nav_districts") : "View Details";

    linkContainer.appendChild(link);
    contentWrapper.appendChild(name);
    contentWrapper.appendChild(linkContainer);

    card.appendChild(imgWrapper);
    card.appendChild(contentWrapper);

    list.appendChild(card);
  });

  container.innerHTML = "";
  container.appendChild(list);
}

window.addEventListener("DOMContentLoaded", renderDistrictList);
window.addEventListener("kmptu:language-change", renderDistrictList);
