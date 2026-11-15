# Contributing to AFTERLIGHT

Thank you for your interest in contributing to **AFTERLIGHT: The machines that stayed behind**.

Because this project is a hybrid of creative technology and scientific history, all contributions must uphold both technical code standards and rigorous historical integrity.

---

## 1. Core Principles

1. **Scientific Authenticity First:** Every object, coordinate, and historical statement must be verified against primary mission documentation (NASA Technical Reports, Apollo Lunar Surface Journal, or peer-reviewed planetary science literature).
2. **Clear Separation of Fact and Art:** Never present artistic reconstructions or speculative interpretations as historical facts. Clearly label any 3D model, shader effect, or narrative element as an artistic visualization when it is not a direct scan.
3. **Strict Asset Provenance:** Every asset added to the repository must include a source URL, institution credit, date, and license status in `catalog/ASSET_INVENTORY.csv`.

---

## 2. Git Branching Strategy

We follow a structured milestone-branching workflow:

- `main` — Stable, approved, production-ready project state. Direct commits to `main` are restricted.
- `phase-01/asset-library` — Phase 01 completed research and asset library milestone.
- `phase-02/design-architecture` — Planned phase branch for user experience, scene architecture, and storyboards.
- `feat/<topic>` — Specific feature work (e.g., `feat/lunar-shader`, `feat/telemetry-overlay`).
- `fix/<issue>` — Bug fixes and data corrections.
- `docs/<topic>` — Substantial documentation updates.

---

## 3. Commit Message Conventions

We enforce standard Conventional Commits with domain-specific prefixes:

- `docs:` Documentation updates, catalog modifications, or research write-ups.
- `assets:` Asset additions, model corrections, or cartographic updates.
- `feat:` New functionality, components, or interactive capabilities.
- `fix:` Bug fixes, incorrect coordinates, or link corrections.
- `refactor:` Code restructuring without changing behavior.
- `chore:` Repository maintenance, configuration, dependencies, or `.gitignore` adjustments.

### Examples:
```bash
git commit -m "docs: add scientific integrity guidelines and roadmap"
git commit -m "assets: add LROC NAC orthophoto for Apollo 12 site"
git commit -m "chore: configure gitattributes for LFS tracking"
```

---

## 4. Documentation Standards

- **Relative Paths Only:** Never include absolute, local, or machine-specific file paths (e.g., `/Users/username/...` or `C:\Users\...`) in markdown documentation or scripts. Always use relative links (e.g., `../assets/3d_models/...`).
- **Markdown Formatting:** Use GitHub-flavored Markdown with standard alerts (`[!NOTE]`, `[!IMPORTANT]`, `[!WARNING]`).
- **LaTeX KaTeX:** Use standard KaTeX math syntax for scientific equations (e.g., radiative equilibrium, Hapke photometric scattering).

---

## 5. Pull Request Expectations

Before opening a pull request:
1. Ensure `catalog/ASSET_INVENTORY.csv` is updated and synchronized if assets were touched.
2. Verify that SHA-256 checksums match the on-disk files.
3. Check that no secret credentials, local `.env` files, or OS clutter (`.DS_Store`) are staged.
4. Provide a clear description of changes, primary historical citations, and visual evidence (screenshots or render comparisons).
