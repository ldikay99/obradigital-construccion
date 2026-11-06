window.OBRADIGITAL_BRAND = {
  name: "ObraDigital",
  tagline: "Empleados digitales para tu obra",
  contactEmail: "REEMPLAZAR@tudominio.com",
  contactLabel: "Agendar demo",
  owner: "Jonathan Paredes",
  country: "Colombia",
  currency: "USD"
};
document.addEventListener("DOMContentLoaded", () => {
  const b = window.OBRADIGITAL_BRAND;
  document.querySelectorAll("[data-brand]").forEach(el => { el.textContent = b.name; });
  document.querySelectorAll("[data-tagline]").forEach(el => { el.textContent = b.tagline; });
  document.querySelectorAll("[data-owner]").forEach(el => { el.textContent = b.owner; });
  document.querySelectorAll("a[data-mailto]").forEach(a => {
    a.href = `mailto:${b.contactEmail}?subject=${encodeURIComponent("Demo " + b.name + " — Empleados digitales construcción")}&body=${encodeURIComponent("Hola, quiero agendar una demo de empleados digitales para construcción.")}`;
    a.textContent = a.dataset.label || b.contactLabel;
  });
  document.title = document.title.replace(/ObraDigital/g, b.name);
});
