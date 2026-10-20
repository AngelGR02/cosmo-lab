/* ============================================================
   CAPA DE DATOS
   Toda la página pide sus datos aquí y nunca lee config.js
   directamente. Cuando migres a Firebase, solo se cambian
   estas tres funciones; el resto de la página no se toca.
   ============================================================ */

window.CosmoData = {

  // HOY: js/config.js  ·  DESPUÉS (Firestore): documento "config/site"
  async getConfig() {
    return window.COSMO_CONFIG;
  },

  // HOY: arreglo COSMO_CATEGORIES  ·  DESPUÉS: colección "categories"
  async getCategories() {
    return window.COSMO_CATEGORIES;
  },

  // HOY: arreglo COSMO_CATALOG  ·  DESPUÉS: colección "products" con los mismos
  // campos (id, category, title, image, price, focus, active).
  // Las imágenes pasarían a Firebase Storage y "image" guardaría su URL.
  async getProducts() {
    return window.COSMO_CATALOG.filter(function (p) { return p.active !== false; });
  }
};
