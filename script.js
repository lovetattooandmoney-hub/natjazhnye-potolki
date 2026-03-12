document.addEventListener("DOMContentLoaded", () => {
  // TODO: замените значения ниже на реальные данные вашего бота
  const TELEGRAM_BOT_TOKEN = "8642976460:AAHoWjXmO_XXNrhA2OM2vDCi3ReQFBoWK6E";
  const TELEGRAM_CHAT_ID = "713217372"; // например 123456789
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  // Smooth scroll for links with hashes
  document.querySelectorAll('a[href^="#"], [data-scroll]').forEach((el) => {
    el.addEventListener("click", (e) => {
      const targetId = el.getAttribute("href")?.startsWith("#")
        ? el.getAttribute("href")
        : el.getAttribute("data-scroll");

      if (!targetId || targetId === "#" || targetId === "#top") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerOffset = 72;
      const rect = target.getBoundingClientRect();
      const offsetTop = rect.top + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    });
  });

  // Calculator
  const calcForm = document.getElementById("calcForm");
  const priceValue = document.getElementById("priceValue");

  if (calcForm && priceValue) {
    calcForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const area = Number(
        /** @type {HTMLInputElement | null} */ (
          document.getElementById("area")
        )?.value || 0
      );
      const type = /** @type {HTMLSelectElement | null} */ (
        document.getElementById("type")
      )?.value;
      const lights = Number(
        /** @type {HTMLInputElement | null} */ (
          document.getElementById("lights")
        )?.value || 0
      );

      if (!area || area < 5) {
        priceValue.textContent = "Уточните площадь от 5 м²";
        return;
      }

      let basePrice = 890; // руб/м²
      if (type === "glossy") basePrice = 930;
      if (type === "satin") basePrice = 970;
      if (type === "multi") basePrice = 1090;

      const lightPrice = 350;
      const total = area * basePrice + lights * lightPrice;

      const formatted = total.toLocaleString("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0,
      });

      priceValue.textContent = formatted;
    });
  }

  // Contact form (fake submit)
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = /** @type {HTMLInputElement | null} */ (
        document.getElementById("name")
      )?.value.trim();
      const phone = /** @type {HTMLInputElement | null} */ (
        document.getElementById("phone")
      )?.value.trim();
      const message = /** @type {HTMLTextAreaElement | null} */ (
        document.getElementById("message")
      )?.value.trim();

      const lines = [
        "Заявка с сайта натяжных потолков",
        name ? `Имя: ${name}` : "",
        phone ? `Телефон: ${phone}` : "",
        message ? `Комментарий: ${message}` : "",
      ].filter(Boolean);

      const text = lines.join("\n");

      if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        alert(
          "Форма настроена, но не указаны данные Telegram-бота. Свяжитесь с разработчиком."
        );
        return;
      }

      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Telegram API error");
          }
          alert(
            "Спасибо! Заявка отправлена. Мы свяжемся с вами в течение 10 минут."
          );
          contactForm.reset();
        })
        .catch(() => {
          alert(
            "Не удалось отправить данные боту. Позвоните по телефону или напишите в Telegram."
          );
        });
    });
  }

  // Modal
  const videoModal = document.getElementById("videoModal");
  const playVideoBtn = document.getElementById("playVideo");
  const heroVideo = /** @type {HTMLVideoElement | null} */ (
    document.getElementById("heroVideo")
  );

  const closeModal = () => {
    if (!videoModal) return;
    videoModal.classList.remove("is-open");
    document.body.style.overflow = "";
    if (heroVideo) {
      heroVideo.pause();
      heroVideo.currentTime = 0;
    }
  };

  const openModal = () => {
    if (!videoModal) return;
    videoModal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    if (heroVideo) {
      heroVideo.play().catch(() => {
        // Автовоспроизведение может быть заблокировано — пользователь сможет нажать Play вручную.
      });
    }
  };

  if (playVideoBtn) {
    playVideoBtn.addEventListener("click", () => {
      openModal();
    });
  }

  if (videoModal) {
    videoModal.addEventListener("click", (e) => {
      const target = /** @type {HTMLElement} */ (e.target);
      if (target.dataset.close === "modal" || target.classList.contains("modal-close")) {
        closeModal();
      }
    });
  }

  // Gallery lightbox
  const galleryModal = document.getElementById("galleryModal");
  const galleryImage = /** @type {HTMLImageElement | null} */ (
    document.getElementById("galleryModalImage")
  );
  const galleryCaption = document.getElementById("galleryModalCaption");
  const galleryPrev = document.getElementById("galleryPrev");
  const galleryNext = document.getElementById("galleryNext");
  const galleryLinks = /** @type {NodeListOf<HTMLButtonElement>} */ (
    document.querySelectorAll(".gallery-link")
  );
  let galleryIndex = 0;

  const openGalleryAt = (index) => {
    if (!galleryModal || !galleryImage) return;
    if (!galleryLinks.length) return;

    galleryIndex = (index + galleryLinks.length) % galleryLinks.length;
    const active = galleryLinks[galleryIndex];
    const src = active.dataset.src;
    const caption = active.dataset.caption || "";

    if (src) {
      galleryImage.src = src;
      galleryImage.alt = caption || "Фотография работы";
    }
    if (galleryCaption) {
      galleryCaption.textContent = caption;
    }

    galleryModal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  const closeGallery = () => {
    if (!galleryModal) return;
    galleryModal.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  if (galleryLinks.length && galleryModal) {
    galleryLinks.forEach((btn, index) => {
      btn.addEventListener("click", () => openGalleryAt(index));
    });

    galleryModal.addEventListener("click", (e) => {
      const target = /** @type {HTMLElement} */ (e.target);
      if (
        target.dataset.close === "gallery" ||
        target.classList.contains("modal-close")
      ) {
        closeGallery();
      }
    });

    if (galleryPrev) {
      galleryPrev.addEventListener("click", (e) => {
        e.stopPropagation();
        openGalleryAt(galleryIndex - 1);
      });
    }

    if (galleryNext) {
      galleryNext.addEventListener("click", (e) => {
        e.stopPropagation();
        openGalleryAt(galleryIndex + 1);
      });
    }

    document.addEventListener("keydown", (e) => {
      if (!galleryModal.classList.contains("is-open")) return;
      if (e.key === "Escape") {
        closeGallery();
      } else if (e.key === "ArrowRight") {
        openGalleryAt(galleryIndex + 1);
      } else if (e.key === "ArrowLeft") {
        openGalleryAt(galleryIndex - 1);
      }
    });
  }

  // Intersection Observer for fade-up elements
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  document
    .querySelectorAll(
      ".section, .card, .step, .stat-card, .calculator-result, .contact-form, .gallery-item"
    )
    .forEach((el) => {
      el.classList.add("fade-up");
      observer.observe(el);
    });
});

