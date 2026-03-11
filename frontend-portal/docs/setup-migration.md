# Setup Module Migration

## Summary
- Seeding CLI dipindahkan dari `_sections/seeder` ke `_sections/initialize` sebagai tahap terakhir inisialisasi.
- Modul `seeder` direstruktur menjadi `starter` untuk konfigurasi Unit dan Stream.
- Alur baru: Initialize (General → Mail → Xendit → Seeding CLI) → Register (Super User).

## Changes
- Initialize:
  - Stage `Seeding` ditambahkan.
  - Komponen `SeedingCLI` baru di `initialize/parts/form/_sections/SeedingCLI.svelte`.
  - Submit Xendit mengalihkan ke Stage `Seeding`.
- Starter:
  - Folder baru `_sections/starter` berisi:
    - `Index.svelte`, `parts/form/Index.svelte`, `parts/visual/Index.svelte`, `Visual.svelte`
    - Form: `UnitForm.svelte`, `StreamForm.svelte`
    - Store: `stores/stage.store.ts`
    - Steps: `const/step.const.ts`
- Screen:
  - `pages.store.ts` menambahkan screen `starter` (mengganti `seeder`).
  - `modules/setup/Index.svelte` mengimpor `StarterSection`.

## Impacted Imports
- Ganti referensi `seeder` dengan `starter` untuk screen dan section.
- Submit Xendit menggunakan `stage.next()` bukan `setScreen('seeder')`.

## Validation
- Build & tests lulus.
- Pastikan rute Setup memuat Initialize → Starter → Register sesuai toggle.

