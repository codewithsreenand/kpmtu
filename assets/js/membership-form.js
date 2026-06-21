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

  // Donation UI Element configuration
  const addDonationChk = document.getElementById("add-donation-chk");
  const donationOptionsContainer = document.getElementById("donation-options-container");
  const customDonationInput = document.getElementById("custom-donation-input");
  const paymentTotalAmount = document.getElementById("payment-total-amount");
  const donationChips = document.querySelectorAll(".donation-chip");

  // Payment Deep Links
  const gpayLink = document.getElementById("gpay-link");
  const phonepeLink = document.getElementById("phonepe-link");
  const paytmLink = document.getElementById("paytm-link");
  const upiPayLink = document.getElementById("upi-pay-link");

  let selectedChipAmount = 0;
  let customDonationAmount = 0;

  function calculateTotal() {
    const isDonationEnabled = addDonationChk && addDonationChk.checked;
    let donation = 0;
    if (isDonationEnabled) {
      if (selectedChipAmount > 0) {
        donation = selectedChipAmount;
      } else {
        donation = customDonationAmount;
      }
    }
    const registrationFee = 10;
    const total = registrationFee + donation;

    // Update UI
    if (paymentTotalAmount) {
      paymentTotalAmount.textContent = `₹${total}`;
    }

    // Update UPI deep links
    const upiQuery = "pa=kera8590838@barodampay&pn=KERALA%20PARAMEDICAL%20TECHNICIANS%20UNION&mc=&tn=Verified%20Merchant&am=" + total + "&cu=INR&url=&mode=02&orgid=159012&mid=&msid=&mtid=&sign=MEYCIQCyuahbB2zJyhrxDsphCTa26+L3voeCIwU5O0qaz2D5xAIhAIaWBJDkZN6yQYK0SIAR24wm4Llriwxey2XKuoYfgCYo";

    if (gpayLink) {
      gpayLink.href = "tez://upi/pay?" + upiQuery;
    }
    if (phonepeLink) {
      phonepeLink.href = "phonepe://pay?" + upiQuery;
    }
    if (paytmLink) {
      paytmLink.href = "paytmmp://pay?" + upiQuery;
    }
    if (upiPayLink) {
      upiPayLink.href = "upi://pay?" + upiQuery;
    }

    return { donation, total };
  }

  if (addDonationChk) {
    addDonationChk.addEventListener("change", () => {
      if (addDonationChk.checked) {
        if (donationOptionsContainer) donationOptionsContainer.style.display = "block";
      } else {
        if (donationOptionsContainer) donationOptionsContainer.style.display = "none";
        // Reset selection values
        selectedChipAmount = 0;
        customDonationAmount = 0;
        if (customDonationInput) customDonationInput.value = "";
        donationChips.forEach(c => c.classList.remove("active"));
      }
      calculateTotal();
    });
  }

  donationChips.forEach(chip => {
    chip.addEventListener("click", () => {
      // Clear custom input since chip is clicked
      if (customDonationInput) {
        customDonationInput.value = "";
        customDonationAmount = 0;
      }

      // Check if already active
      if (chip.classList.contains("active")) {
        chip.classList.remove("active");
        selectedChipAmount = 0;
      } else {
        donationChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        selectedChipAmount = parseInt(chip.getAttribute("data-val") || "0", 10);
      }
      calculateTotal();
    });
  });

  if (customDonationInput) {
    customDonationInput.addEventListener("input", () => {
      const val = parseInt(customDonationInput.value, 10);
      customDonationAmount = isNaN(val) || val < 0 ? 0 : val;
      
      // Clear active chips if user enters custom donation
      if (customDonationAmount > 0) {
        donationChips.forEach(c => c.classList.remove("active"));
        selectedChipAmount = 0;
      }
      calculateTotal();
    });
  }

  form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    calculateTotal(); // Ensure calculation is fresh
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

      // Add donation and payment details to the payload
      const { donation, total } = calculateTotal();
      data.registrationFee = 10;
      data.membershipFee = 10;
      data.donationAmount = donation;
      data.totalAmount = total;

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
      
      // Reset form and modal values
      form.reset();
      if (addDonationChk) {
        addDonationChk.checked = false;
      }
      if (donationOptionsContainer) {
        donationOptionsContainer.style.display = "none";
      }
      if (customDonationInput) {
        customDonationInput.value = "";
      }
      selectedChipAmount = 0;
      customDonationAmount = 0;
      donationChips.forEach(c => c.classList.remove("active"));
      calculateTotal();

      form.scrollIntoView({ behavior: "smooth" });

      setTimeout(() => {
        window.location.href = "https://chat.whatsapp.com/Eqp6HkcKPuZ8hDc06YDLwf";
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
