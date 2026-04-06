function renderDistrictOptions() {
  const select = document.getElementById("district");
  if (!select || !window.KPMTU_DATA) return;
  const currentValue = select.value;

  select.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.setAttribute("data-i18n", "form_district_placeholder");
  placeholder.textContent = t("form_district_placeholder");
  select.appendChild(placeholder);

  (window.KPMTU_DATA.districts || []).forEach((district) => {
    const option = document.createElement("option");
    option.value = district.id;
    option.textContent = district.name[document.documentElement.lang] || district.name.en;
    select.appendChild(option);
  });

  if (currentValue) {
    select.value = currentValue;
  }
}

function initMembershipForm() {
  const form = document.getElementById("membership-form");
  const alertBox = document.getElementById("form-success");
  if (!form || !alertBox) return;

  renderDistrictOptions();

  form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    alertBox.querySelector("strong").textContent = t("form_success_title");
    alertBox.querySelector("span").textContent = t("form_success_message");
    alertBox.style.display = "flex";
    form.scrollIntoView({ behavior: "smooth" });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  initMembershipForm();
});

window.addEventListener("kmptu:language-change", () => {
  renderDistrictOptions();
});
