function renderHomeLeadership() {
  const container = document.getElementById("home-leadership");
  if (!container || !window.KPMTU_DATA) return;

  container.innerHTML = "";
  const list = document.createElement("div");
  list.className = "columns";

  (window.KPMTU_DATA.stateCommittee || []).slice(0, 4).forEach((member) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.display = "flex";
    card.style.gap = "1.2rem";
    card.style.alignItems = "center";
    card.style.padding = "1.5rem 1rem";

    const avatar = document.createElement("div");
    avatar.style.width = "75px";
    avatar.style.height = "75px";
    avatar.style.borderRadius = "50%";
    avatar.style.background = "var(--bg-alt)";
    avatar.style.display = "grid";
    avatar.style.placeItems = "center";
    avatar.style.flexShrink = "0";
    avatar.style.border = "2px solid var(--border)";
    avatar.style.overflow = "hidden";

    const img = document.createElement("img");
    // Use fallback dummy photo logic if original source fails
    img.src = member.photo;
    img.onerror = () => {
      img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name.en)}&background=001a33&color=fff&size=150&bold=true`;
    };
    // Leave alt empty if img fails to prevent duplication text on broken images
    img.alt = ""; 
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    avatar.appendChild(img);

    const text = document.createElement("div");
    text.style.flex = "1";
    
    const name = document.createElement("div");
    name.style.fontWeight = "800";
    name.style.fontSize = "1.1rem";
    name.style.marginBottom = "0.2rem";
    name.textContent = member.name[document.documentElement.lang] || member.name.en;

    const role = document.createElement("div");
    role.style.fontSize = "0.95rem";
    role.style.color = "var(--muted)";
    role.style.lineHeight = "1.4";
    role.textContent = member.role[document.documentElement.lang] || member.role.en;

    text.appendChild(name);
    text.appendChild(role);

    card.appendChild(avatar);
    card.appendChild(text);
    list.appendChild(card);
  });

  container.appendChild(list);
}

function renderHomeDistricts() {
  const container = document.getElementById("home-districts");
  if (!container || !window.KPMTU_DATA) return;
  container.innerHTML = "";

  const list = document.createElement("div");
  list.className = "columns";

  // Show all districts instead of slicing to 4
  (window.KPMTU_DATA.districts || []).forEach((district) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.padding = "0";
    card.style.overflow = "hidden";

    // District Image matched to culture
    const imgWrapper = document.createElement("div");
    imgWrapper.style.width = "100%";
    imgWrapper.style.height = "180px";
    imgWrapper.style.backgroundColor = "var(--bg-alt)";
    
    const img = document.createElement("img");
    // Fallback to LoremFlickr since pollinations API is down
    const pSeed = district.id.charCodeAt(0) + district.id.length; 
    img.src = `https://loremflickr.com/400/250/kerala,landscape?lock=${pSeed}`;
    img.alt = district.name.en;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.loading = "lazy";
    imgWrapper.appendChild(img);

    const contentWrapper = document.createElement("div");
    contentWrapper.style.padding = "1.5rem";
    contentWrapper.style.display = "flex";
    contentWrapper.style.flexDirection = "column";
    contentWrapper.style.flex = "1";

    const title = document.createElement("h3");
    title.style.marginBottom = "1.5rem";
    title.textContent = district.name[document.documentElement.lang] || district.name.en;

    const link = document.createElement("a");
    link.href = `district.html?district=${encodeURIComponent(district.id)}`;
    link.className = "btn btn-outline";
    link.style.alignSelf = "flex-start";
    link.style.marginTop = "auto";
    link.textContent = typeof t === 'function' ? t("nav_districts") : "View Details";

    contentWrapper.appendChild(title);
    contentWrapper.appendChild(link);

    card.appendChild(imgWrapper);
    card.appendChild(contentWrapper);
    list.appendChild(card);
  });

  container.appendChild(list);
}

function initHomePage() {
  renderHomeLeadership();
  renderHomeDistricts();
}

window.addEventListener("DOMContentLoaded", initHomePage);
window.addEventListener("kmptu:language-change", () => {
  renderHomeLeadership();
  renderHomeDistricts();
});
