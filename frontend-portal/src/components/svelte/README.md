# Atomic Design System (Svelte)

Sistem komponen ini mengikuti prinsip **Atomic Design** untuk memastikan reusability, skalabilitas, dan kemudahan pemeliharaan.

## Hierarki Komponen

### 1. Atoms
Komponen paling dasar yang tidak dapat dipecah lagi.
- `atoms/Button.svelte`: Komponen tombol utama dengan berbagai varian (primary, outline, ghost).
- `atoms/Badge.svelte`: Label kecil untuk informasi status atau kategori.
- `atoms/Icon.svelte`: Wrapper SVG untuk ikon sistem.
- `atoms/Avatar.svelte`: Komponen gambar profil lingkaran.

### 2. Molecules
Gabungan dari beberapa atoms yang membentuk satu fungsi spesifik.
- `molecules/NavLink.svelte`: Item navigasi dengan state aktif.
- `molecules/StatBadge.svelte`: Badge informasi melayang dengan ikon (seperti di Hero).
- `molecules/FeatureCard.svelte`: Kartu fitur dengan ikon, judul, dan deskripsi.
- `molecules/TestimonialCard.svelte`: Kartu testimoni dengan kutipan dan info penulis.

### 3. Organisms
Komponen kompleks yang membentuk bagian utuh dari antarmuka.
- `organisms/Navbar.svelte`: Header navigasi utama.
- `organisms/Hero.svelte`: Bagian utama landing page (Headline & CTA).
- `organisms/FeaturesSection.svelte`: Grid berisi kartu-kartu fitur.
- `organisms/TestimonialCarousel.svelte`: Komponen carousel untuk testimoni.
- `organisms/Footer.svelte`: Bagian bawah halaman dengan link dan info kontak.

### 4. Templates
Layout struktur halaman tanpa konten spesifik.
- `templates/LandingTemplate.svelte`: Layout untuk landing page.

### 5. Pages
Instance dari template dengan data dan konten nyata.
- `pages/LandingPage.svelte`: Halaman landing lengkap.

## Best Practices
- Gunakan **props** untuk kustomisasi komponen.
- Gunakan **Svelte Snippets** untuk konten dinamis (slots).
- Semua gaya menggunakan **Tailwind CSS**.
- Implementasikan animasi micro-interaction menggunakan Svelte transitions atau Tailwind animate.
