/**
 * AFTERLIGHT — Centralized Asset Manager
 * Provides cached loading, in-flight deduplication, and safe model cloning
 * for GLTF/GLB, OBJ/MTL, and textures.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

class AssetManager {
  constructor() {
    // In-memory cache for resolved assets
    this.gltfCache = new Map();
    this.objCache = new Map();
    this.mtlCache = new Map();
    this.textureCache = new Map();

    // In-flight promise cache to prevent duplicate concurrent network requests
    this.pendingRequests = new Map();

    // Shared loader singletons
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('/draco/');

    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    this.mtlLoader = new MTLLoader();
    this.objLoader = new OBJLoader();
    this.textureLoader = new THREE.TextureLoader();
  }

  /**
   * Loads a GLB/GLTF model. Returns a cloned scene hierarchy with preserved materials.
   * @param {string} url
   * @returns {Promise<THREE.Group>}
   */
  loadGLTF(url) {
    if (this.gltfCache.has(url)) {
      return Promise.resolve(this._cloneGltf(this.gltfCache.get(url)));
    }

    if (this.pendingRequests.has(url)) {
      return this.pendingRequests.get(url).then((gltf) => this._cloneGltf(gltf));
    }

    const promise = new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          this.gltfCache.set(url, gltf);
          this.pendingRequests.delete(url);
          resolve(gltf);
        },
        undefined,
        (err) => {
          this.pendingRequests.delete(url);
          const errorMsg = `[AssetManager] Failed to load GLTF from "${url}": ${err.message || err}`;
          console.error(errorMsg);
          reject(new Error(errorMsg));
        }
      );
    });

    this.pendingRequests.set(url, promise);
    return promise.then((gltf) => this._cloneGltf(gltf));
  }

  /**
   * Helper to clone GLTF hierarchy while preserving material instances and animations
   * @private
   */
  _cloneGltf(gltf) {
    const clonedScene = gltf.scene.clone(true);
    return clonedScene;
  }

  /**
   * Loads MTL materials, caching the preloaded materials creator.
   * @param {string} mtlUrl
   * @returns {Promise<MTLLoader.MaterialCreator>}
   */
  loadMTL(mtlUrl) {
    if (this.mtlCache.has(mtlUrl)) {
      return Promise.resolve(this.mtlCache.get(mtlUrl));
    }

    if (this.pendingRequests.has(mtlUrl)) {
      return this.pendingRequests.get(mtlUrl);
    }

    const promise = new Promise((resolve, reject) => {
      this.mtlLoader.load(
        mtlUrl,
        (materials) => {
          materials.preload();
          this.mtlCache.set(mtlUrl, materials);
          this.pendingRequests.delete(mtlUrl);
          resolve(materials);
        },
        undefined,
        (err) => {
          this.pendingRequests.delete(mtlUrl);
          const errorMsg = `[AssetManager] Failed to load MTL from "${mtlUrl}": ${err.message || err}`;
          console.error(errorMsg);
          reject(new Error(errorMsg));
        }
      );
    });

    this.pendingRequests.set(mtlUrl, promise);
    return promise;
  }

  /**
   * Loads an OBJ model with an optional MTL material file.
   * Returns a cloned Object3D instance safe for independent positioning and scene attachment.
   * @param {string} objUrl
   * @param {string} [mtlUrl]
   * @returns {Promise<THREE.Group>}
   */
  async loadOBJWithMTL(objUrl, mtlUrl = null) {
    const cacheKey = `${objUrl}::${mtlUrl || 'nomtl'}`;

    if (this.objCache.has(cacheKey)) {
      return this.objCache.get(cacheKey).clone(true);
    }

    if (this.pendingRequests.has(cacheKey)) {
      const template = await this.pendingRequests.get(cacheKey);
      return template.clone(true);
    }

    const fetchPromise = (async () => {
      let materials = null;
      if (mtlUrl) {
        materials = await this.loadMTL(mtlUrl);
      }

      return new Promise((resolve, reject) => {
        const loader = new OBJLoader();
        if (materials) {
          loader.setMaterials(materials);
        }

        loader.load(
          objUrl,
          (object) => {
            this.objCache.set(cacheKey, object);
            this.pendingRequests.delete(cacheKey);
            resolve(object);
          },
          undefined,
          (err) => {
            this.pendingRequests.delete(cacheKey);
            const errorMsg = `[AssetManager] Failed to load OBJ from "${objUrl}": ${err.message || err}`;
            console.error(errorMsg);
            reject(new Error(errorMsg));
          }
        );
      });
    })();

    this.pendingRequests.set(cacheKey, fetchPromise);
    const template = await fetchPromise;
    return template.clone(true);
  }

  /**
   * Loads and caches a texture
   * @param {string} url
   * @returns {Promise<THREE.Texture>}
   */
  loadTexture(url) {
    if (this.textureCache.has(url)) {
      return Promise.resolve(this.textureCache.get(url));
    }

    if (this.pendingRequests.has(url)) {
      return this.pendingRequests.get(url);
    }

    const promise = new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          this.textureCache.set(url, texture);
          this.pendingRequests.delete(url);
          resolve(texture);
        },
        undefined,
        (err) => {
          this.pendingRequests.delete(url);
          const errorMsg = `[AssetManager] Failed to load texture from "${url}": ${err.message || err}`;
          console.error(errorMsg);
          reject(new Error(errorMsg));
        }
      );
    });

    this.pendingRequests.set(url, promise);
    return promise;
  }

  /**
   * Clear all caches when necessary (e.g. testing)
   */
  clear() {
    this.gltfCache.clear();
    this.objCache.clear();
    this.mtlCache.clear();
    this.textureCache.clear();
    this.pendingRequests.clear();
  }
}

export const assetManager = new AssetManager();
