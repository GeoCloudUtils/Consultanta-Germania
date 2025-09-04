// reveal on scroll for .services cards + set year
(function () {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
  const cards = document.querySelectorAll(".services .card");
  if (!("IntersectionObserver" in window)) {
    cards.forEach((c) => c.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  cards.forEach((c) => io.observe(c));

  (function () {
    const input = document.getElementById("files");
    const drop = document.getElementById("dropzone");
    const list = document.getElementById("fileList");
    const totals = document.getElementById("fileTotals");
    const form = document.getElementById("contactForm");

    const MAX_PER_FILE = 10 * 1024 * 1024; // 10MB
    const MAX_TOTAL = 25 * 1024 * 1024; // 25MB
    const ACCEPTED = [
      "pdf",
      "jpg",
      "jpeg",
      "png",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "odt",
      "ods",
    ];

    function fmtSize(b) {
      return b > 1048576
        ? (b / 1048576).toFixed(1) + " MB"
        : (b / 1024).toFixed(0) + " KB";
    }

    function renderList(files) {
      list.innerHTML = "";
      let total = 0;
      [...files].forEach((f) => {
        total += f.size;
        const ext = (f.name.split(".").pop() || "").toLowerCase();
        const item = document.createElement("div");
        item.className = "file-item";
        item.innerHTML = `
            <span class="badge bg-secondary">${ext || "file"}</span>
            <span class="flex-grow-1 text-truncate">${f.name}</span>
            <span class="file-size">${fmtSize(f.size)}</span>
          `;
        list.appendChild(item);
      });
      totals.textContent = files.length
        ? `Selectate: ${files.length} • Total: ${fmtSize(total)}`
        : "";
    }

    function validateFiles(files) {
      let total = 0;
      for (const f of files) {
        const ext = (f.name.split(".").pop() || "").toLowerCase();
        if (!ACCEPTED.includes(ext)) {
          alert(`Fișier neacceptat: ${f.name}`);
          return false;
        }
        if (f.size > MAX_PER_FILE) {
          alert(`"${f.name}" depășește 10MB.`);
          return false;
        }
        total += f.size;
        if (total > MAX_TOTAL) {
          alert("Totalul fișierelor depășește 25MB.");
          return false;
        }
      }
      return true;
    }

    // Drag & drop
    ["dragenter", "dragover"].forEach((evt) => {
      drop.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        drop.classList.add("dragover");
      });
    });
    ["dragleave", "drop"].forEach((evt) => {
      drop.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        drop.classList.remove("dragover");
      });
    });
    drop.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      if (validateFiles(files)) {
        input.files = files; // atașează în input pentru submit
        renderList(files);
      }
    });

    // Select din dialog
    input.addEventListener("change", (e) => {
      const files = e.target.files;
      if (!validateFiles(files)) {
        input.value = "";
        list.innerHTML = "";
        totals.textContent = "";
        return;
      }
      renderList(files);
    });

    // Opțional: blocare submit dacă e nevoie de backend
    form.addEventListener("submit", function (e) {
      // TODO: setează action către endpointul tău (ex: Formspree, server propriu)
      // dacă rămâne "#", prevenim submitul ca să nu „spargă” pagina.
      if (form.getAttribute("action") === "#") {
        e.preventDefault();
        alert(
          "Formularul este pregătit. Configurează atributul `action` spre endpoint-ul tău pentru a primi mesajele."
        );
      }
    });
  });
})();
