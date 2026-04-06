window.addEventListener("DOMContentLoaded", () => {
    const intro = document.getElementById("intro-screen");
    
    if (intro) {
        // Force scroll to top so intro is always seen
        window.scrollTo(0, 0);
        document.body.style.overflow = "hidden"; // Prevent scrolling during intro
        
        // Hide overlay smoothly after load sequence
        setTimeout(() => {
            intro.classList.add("intro-hidden");
            document.body.style.overflow = ""; // Restore scrolling
        }, 2200);
        
        // Remove from DOM entirely
        setTimeout(() => {
            if(intro.parentNode) intro.parentNode.removeChild(intro);
        }, 3200);
    }
});
