function renderStateCommittee() {
  const container = document.getElementById("state-committee");
  if (!container || !window.KPMTU_DATA) return;

  const members = window.KPMTU_DATA.stateCommittee || [];
  container.innerHTML = "";

  const list = document.createElement("div");
  list.style.display = "grid";
  list.style.gridTemplateColumns = "repeat(auto-fill, minmax(320px, 1fr))";
  list.style.gap = "1.5rem";

  members.forEach((member) => {
    const item = document.createElement("div");
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.gap = "1.2rem";
    item.style.padding = "1.2rem";
    item.style.border = "1px solid var(--border)";
    item.style.borderRadius = "var(--radius)";
    item.style.background = "var(--surface)";
    item.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";

    const avatar = document.createElement("img");
    avatar.src = member.photo;
    avatar.onerror = () => {
      avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name.en)}&background=001a33&color=fff&size=150&bold=true`;
    };
    avatar.alt = ""; // Prevents duplicated name text if image is broken
    avatar.style.width = "80px";
    avatar.style.height = "80px";
    avatar.style.objectFit = "cover";
    avatar.style.borderRadius = "50%";
    avatar.style.border = "2px solid var(--border)";

    const text = document.createElement("div");
    text.style.flex = "1";
    text.style.display = "flex";
    text.style.flexDirection = "column";
    text.style.overflow = "hidden";

    const name = document.createElement("div");
    name.style.fontWeight = "700";
    name.style.fontSize = "1.1rem";
    name.style.marginBottom = "0.2rem";
    name.textContent = member.name[document.documentElement.lang] || member.name.en;

    const role = document.createElement("div");
    role.style.color = "var(--muted)";
    role.style.fontSize = "0.9rem";
    role.style.lineHeight = "1.4";
    role.textContent = member.role[document.documentElement.lang] || member.role.en;

    text.appendChild(name);
    text.appendChild(role);
    item.appendChild(avatar);
    item.appendChild(text);

    // hover effect
    item.onmouseenter = () => {
      item.style.transform = "translateY(-2px)";
      item.style.boxShadow = "var(--shadow)";
    };
    item.onmouseleave = () => {
      item.style.transform = "none";
      item.style.boxShadow = "none";
    };

    list.appendChild(item);
  });

  container.appendChild(list);
}

function renderDistrictLeaders() {
  const container = document.getElementById("district-leaders");
  if (!container || !window.KPMTU_DATA) return;

  const districts = window.KPMTU_DATA.districts || [];
  container.innerHTML = "";

  let hasLeaders = false;

  districts.forEach((district) => {
    // Only show districts that have committee members
    if (!district.committee || district.committee.length === 0) return;
    hasLeaders = true;

    const districtSection = document.createElement("div");
    districtSection.style.marginBottom = "1.5rem";
    districtSection.style.padding = "1.5rem";
    districtSection.style.border = "1px solid var(--border)";
    districtSection.style.borderRadius = "var(--radius)";
    districtSection.style.background = "var(--surface)";

    const districtTitle = document.createElement("h3");
    districtTitle.style.fontSize = "1.1rem";
    districtTitle.style.fontWeight = "600";
    districtTitle.style.marginBottom = "1.2rem";
    districtTitle.style.paddingBottom = "0.8rem";
    districtTitle.style.borderBottom = "1px solid var(--border)";
    
    const lang = document.documentElement.lang;
    const districtName = district.name[lang] || district.name.en;
    districtTitle.textContent = lang === "ml" ? `${districtName} ജില്ലാ കമ്മിറ്റി` : `${districtName} District Committee`;
    districtSection.appendChild(districtTitle);

    const membersList = document.createElement("div");
    membersList.style.display = "grid";
    membersList.style.gridTemplateColumns = "repeat(auto-fill, minmax(280px, 1fr))";
    membersList.style.gap = "1rem";

    district.committee.forEach((member) => {
      const card = document.createElement("div");
      card.style.padding = "1rem";
      card.style.backgroundColor = "var(--background)";
      card.style.border = "1px solid var(--border)";
      card.style.borderRadius = "8px";
      card.style.display = "flex";
      card.style.flexDirection = "column";
      card.style.gap = "0.3rem";

      const name = document.createElement("div");
      name.style.fontWeight = "600";
      name.style.fontSize = "1rem";
      name.textContent = member.name[lang] || member.name.en;

      const role = document.createElement("div");
      role.style.fontSize = "0.85rem";
      role.style.color = "var(--muted)";
      role.textContent = member.role[lang] || member.role.en;

      card.appendChild(name);
      card.appendChild(role);
      membersList.appendChild(card);
    });

    districtSection.appendChild(membersList);
    container.appendChild(districtSection);
  });
  
  if (!hasLeaders) {
    const emptyMsg = document.createElement("p");
    emptyMsg.className = "text-muted";
    emptyMsg.style.marginTop = "0.5rem";
    emptyMsg.setAttribute("data-i18n", "leadership_district_empty");
    emptyMsg.textContent = "District leaders will be updated when available.";
    container.appendChild(emptyMsg);
  }
}

function renderAll() {
  renderStateCommittee();
  renderDistrictLeaders();
}

window.addEventListener("DOMContentLoaded", renderAll);
window.addEventListener("kmptu:language-change", renderAll);
