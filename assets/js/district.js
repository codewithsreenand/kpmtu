function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function renderDistrict() {
  const districtId = getQueryParam("district");
  const container = document.getElementById("district-content");
  if (!container) return;

  const district = (window.KPMTU_DATA?.districts || []).find((d) => d.id === districtId);
  if (!district) {
    container.innerHTML = `<p class="text-muted">${t("placeholder_activity")}</p>`;
    return;
  }

  const name = district.name[document.documentElement.lang] || district.name.en;
  const members = district.committee || [];
  const activities = district.activities || [];
  const gallery = district.gallery || [];

  const html = [];
  html.push(`<h2 class="section-title">${name}</h2>`);

  html.push(`<div class="row" style="gap:1.5rem; margin-top:1rem;">
      <div style="flex:1 1 320px;">
        <h3 class="section-title" style="font-size:1.2rem;">${t("district_members_title")}</h3>
        ${members.length ? `<ul class="list-plain">${members
          .map((member) => {
            const label = member.name[document.documentElement.lang] || member.name.en;
            const role = member.role[document.documentElement.lang] || member.role.en;
            return `<li><strong>${label}</strong><br/><span class="text-muted">${role}</span></li>`;
          })
          .join("")}</ul>` : `<p class="text-muted">${t("placeholder_activity")}</p>`}
      </div>
      <div style="flex:1 1 320px;">
        <h3 class="section-title" style="font-size:1.2rem;">${t("district_contact_title")}</h3>
        <p><strong>${t("contact_address_label")}:</strong><br/>${district.contact.address}</p>
        <p><strong>${t("contact_phone_label")}:</strong> ${district.contact.phone}</p>
        <p><strong>${t("contact_email_label")}:</strong> <a href="mailto:${district.contact.email}">${district.contact.email}</a></p>
      </div>
    </div>`);

  html.push(`<div style="margin-top:2rem;">
      <h3 class="section-title" style="font-size:1.2rem;">${t("district_activities_title")}</h3>
      ${activities.length
        ? `<ul class="list-plain">${activities
            .map((activity) => `<li>${activity[document.documentElement.lang] || activity.en}</li>`)
            .join("")}</ul>`
        : `<p class="text-muted">${t("placeholder_activity")}</p>`}
    </div>`);

  if (gallery.length > 0) {
    html.push(`<div style="margin-top:2.5rem;">
      <h3 class="section-title" style="font-size:1.2rem;">${document.documentElement.lang === 'ml' ? 'ചിത്രശാല' : 'Gallery'}</h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:1.2rem; margin-top:1.5rem;">
        ${gallery.map(img => `
          <div style="border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); aspect-ratio: 4/3; background: var(--surface);">
            <img src="${img}" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;" alt="District Event Photo" 
                 onerror="this.src='https://placehold.co/600x400/183c5e/ffffff?text=Pending+Upload'"
                 onclick="if(this.src.indexOf('placehold.co')===-1) window.open(this.src, '_blank')">
          </div>
        `).join("")}
      </div>
    </div>`);
  }

  container.innerHTML = html.join("");
}

window.addEventListener("DOMContentLoaded", () => {
  renderDistrict();
});

window.addEventListener("kmptu:language-change", () => {
  renderDistrict();
});
