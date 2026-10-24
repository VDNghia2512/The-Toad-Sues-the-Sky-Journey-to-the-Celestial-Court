/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "screenshot-mobile.png",
    "revision": "76ec26ca871e40f88f5edfcb00a64f63"
  }, {
    "url": "screenshot-desktop.png",
    "revision": "dc6620701be115a6ed9300a870406eaf"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "eae1168521dfe112d5c9bc4dfbf046ee"
  }, {
    "url": "pwa-512x512.png",
    "revision": "8c82a9a754913ade01114864ac2fb5cd"
  }, {
    "url": "pwa-192x192.png",
    "revision": "5518f92b1267ce1d5738f48b7b880a91"
  }, {
    "url": "index.html",
    "revision": "f670ecaf6594cd1ab0d527c2e6de39b1"
  }, {
    "url": "icon.svg",
    "revision": "2834898c2eb202f044e57b1ef9fb8592"
  }, {
    "url": "favicon.png",
    "revision": "2cd43899e7382f0d3d11e091cb2dc958"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "a4ca3186185033fd65f7775a7768f9f0"
  }, {
    "url": "assets/workbox-window.prod.es5-Bd17z0YL.js",
    "revision": null
  }, {
    "url": "assets/web-DCu1gWt-.js",
    "revision": null
  }, {
    "url": "assets/index-JYWzPeou.js",
    "revision": null
  }, {
    "url": "assets/index--lmzsXUk.css",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "a4ca3186185033fd65f7775a7768f9f0"
  }, {
    "url": "favicon.png",
    "revision": "2cd43899e7382f0d3d11e091cb2dc958"
  }, {
    "url": "icon.svg",
    "revision": "2834898c2eb202f044e57b1ef9fb8592"
  }, {
    "url": "pwa-192x192.png",
    "revision": "5518f92b1267ce1d5738f48b7b880a91"
  }, {
    "url": "pwa-512x512.png",
    "revision": "8c82a9a754913ade01114864ac2fb5cd"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "eae1168521dfe112d5c9bc4dfbf046ee"
  }, {
    "url": "manifest.webmanifest",
    "revision": "e3a19272daf313aa50dc301d416b1cda"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
