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

function getBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve({ base64: reader.result, mimeType: file.type });
    reader.onerror = error => reject(error);
  });
}

function initMembershipForm() {
  const form = document.getElementById("membership-form");
  const alertBox = document.getElementById("form-success");
  const paymentModal = document.getElementById("payment-modal");
  const closePaymentBtn = document.getElementById("close-payment");
  const finalSubmitBtn = document.getElementById("final-submit");

  if (!form || !alertBox || !paymentModal) return;

  renderDistrictOptions();

  form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    paymentModal.style.display = "flex";
  });

  closePaymentBtn.addEventListener("click", () => {
    paymentModal.style.display = "none";
  });

  finalSubmitBtn.addEventListener("click", async () => {
    const photoFile = document.getElementById("photo")?.files[0];
    const screenshotFile = document.getElementById("paymentScreenshot")?.files[0];
    
    // Validate
    if (!screenshotFile) {
      alert("Please upload a payment screenshot to proceed.");
      return;
    }

    // Add loading text
    finalSubmitBtn.textContent = "Uploading (Please Wait)...";
    finalSubmitBtn.disabled = true;

    try {
      const photoData = await getBase64(photoFile);
      const screenshotData = await getBase64(screenshotFile);
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      if (photoData) {
        data.photoBase64 = photoData.base64;
        data.photoMimeType = photoData.mimeType;
      }
      if (screenshotData) {
        data.paymentScreenshotBase64 = screenshotData.base64;
        data.paymentScreenshotMimeType = screenshotData.mimeType;
      }

      const scriptURL = "https://script.google.com/macros/s/AKfycbxzmrf_YzevSkOGDaK7htPHAlIlxp9XOUr6bsVs9W56eOUZoRBOm0Jt9MX2uIuzgIZ8_g/exec";
      
      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data),
      });

      // no-cors fetch doesn't expose response status, assuming success if no throw
      paymentModal.style.display = "none";
      alertBox.querySelector("strong").textContent = "Submission Successful!";
      alertBox.querySelector("span").textContent = "Thank you! Membership registration is complete. Redirecting to WhatsApp group...";
      alertBox.style.display = "flex";
      form.reset();
      form.scrollIntoView({ behavior: "smooth" });

      setTimeout(() => {
        window.location.href = "https://chat.whatsapp.com/I9iJH6OPzynIgWqBGnULQ9?mode=gi_t";
      }, 2500);

    } catch (error) {
      alert("Network error: Please try again later.");
      console.error("Submission failed", error);
    } finally {
      finalSubmitBtn.textContent = "Complete Registration";
      finalSubmitBtn.disabled = false;
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  initMembershipForm();
});

window.addEventListener("kmptu:language-change", () => {
  renderDistrictOptions();
});
