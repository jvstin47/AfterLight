import { ARTIFACTS } from '../data/artifactsData.js';
import { TRAVERSE_DATA } from '../data/traverseData.js';

export class FallbackView {
  /**
   * @param {HTMLElement} container 
   */
  constructor(container) {
    this.container = container;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="fallback-archive">
        <header class="fallback-header">
          <div class="fallback-tag">ARCHIVAL DOCUMENTATION // WEBGL ACCESSIBILITY MODE</div>
          <h1 class="fallback-title">AFTERLIGHT &mdash; APOLLO 12</h1>
          <p class="fallback-subtitle">The machines that stayed behind at Statio Cognitum (3.01239° S, 23.42157° W).</p>
        </header>

        <section class="fallback-section">
          <h2 class="fallback-heading">PRIMARY LUNAR ARTIFACTS</h2>
          <div class="fallback-grid">
            ${Object.values(ARTIFACTS)
              .map(
                (art) => `
              <article class="fallback-card">
                <div class="fallback-card-tag">${art.designation} &bull; ${art.status}</div>
                <h3 class="fallback-card-title">${art.name}</h3>
                <p class="fallback-card-desc">${art.narrative.origin.content}</p>
                
                <div class="fallback-specs">
                  <strong>Specifications:</strong>
                  <ul>
                    ${Object.entries(art.specs)
                      .map(([k, v]) => `<li><em>${k}:</em> ${v}</li>`)
                      .join('')}
                  </ul>
                </div>

                ${
                  art.gallery && art.gallery.length > 0
                    ? `
                  <div class="fallback-gallery">
                    <img src="${art.gallery[0].url}" alt="${art.gallery[0].caption}" />
                    <span class="fallback-img-caption">${art.gallery[0].caption}</span>
                  </div>
                `
                    : ''
                }
              </article>
            `
              )
              .join('')}
          </div>
        </section>

        <section class="fallback-section">
          <h2 class="fallback-heading">SURFACE TRAVERSE HISTORY</h2>
          <div class="fallback-traverse-info">
            <p><strong>EVA 1:</strong> ${TRAVERSE_DATA.eva1.description}</p>
            <p><strong>EVA 2:</strong> ${TRAVERSE_DATA.eva2.description}</p>
          </div>
        </section>
      </div>
    `;
  }
}
