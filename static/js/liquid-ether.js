import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const vertexShader = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uPointerStrength;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uBase;
varying vec2 vUv;

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
    );
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.86, -0.5, 0.5, 0.86);
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = rot * p * 2.02 + 17.13;
        a *= 0.52;
    }
    return v;
}

float etherBlob(vec2 p, vec2 center, float radius, float softness) {
    float d = length(p - center);
    return exp(-pow(d / radius, softness));
}

void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    float t = uTime * 0.22;

    vec2 warp = vec2(
        fbm(p * 2.1 + vec2(t * 0.65, -t * 0.28)),
        fbm(p * 2.1 + vec2(-t * 0.34, t * 0.55))
    ) - 0.5;
    vec2 q = p + warp * 0.22;

    float field = 0.0;
    field += etherBlob(q, vec2(-0.35 + sin(t * 1.9) * 0.16, 0.18 + cos(t * 1.3) * 0.12), 0.36, 2.15);
    field += etherBlob(q, vec2(0.32 + cos(t * 1.4) * 0.18, -0.08 + sin(t * 1.7) * 0.14), 0.32, 2.0);
    field += etherBlob(q, vec2(0.02 + sin(t * 0.9) * 0.25, 0.36 + cos(t * 1.1) * 0.08), 0.28, 2.25);
    field += etherBlob(q, vec2(0.58 + sin(t * 1.1) * 0.08, -0.34 + cos(t * 1.8) * 0.12), 0.42, 2.35);
    field += etherBlob(q, vec2(-0.65 + cos(t * 1.5) * 0.1, -0.42 + sin(t * 0.95) * 0.16), 0.34, 2.2);

    vec2 pointer = (uPointer - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    float pointerGlow = etherBlob(q, pointer, 0.3, 2.0) * uPointerStrength;
    field += pointerGlow * 0.95;

    float veil = smoothstep(0.18, 1.55, field);
    float core = smoothstep(0.7, 2.0, field);
    float grain = fbm(p * 7.0 + t * 0.7) * 0.055;

    vec3 ether = mix(uColorA, uColorB, smoothstep(0.2, 1.1, field + warp.x * 0.35));
    ether = mix(ether, uColorC, core);
    float wake = smoothstep(0.34, 0.88, fbm(q * 3.1 + vec2(t * 1.7, -t * 1.15)));
    vec3 color = mix(uBase, ether, veil * 0.34);
    color += ether * wake * 0.12;
    color += vec3(0.12, 0.19, 0.17) * pointerGlow * 0.2;
    color += vec3(grain * 0.55);

    float vignette = smoothstep(0.92, 0.24, length((uv - 0.5) * vec2(1.06, 1.0)));
    color *= 0.66 + vignette * 0.32;
    color += vec3(0.018, 0.026, 0.024) * (1.0 - vignette);

    gl_FragColor = vec4(color, 1.0);
}
`;

const presets = {
    hero: {
        colors: ['#fffaf1', '#d8a23a', '#0f8f89'],
        base: '#0b1110',
        autoDemo: true,
        autoSpeed: 0.58,
        autoIntensity: 1.65,
        pointerDampening: 0.09,
        dpr: 1.35,
    },
    gateway: {
        colors: ['#fffaf1', '#d8a23a', '#0f8f89'],
        base: '#0b1110',
        autoDemo: true,
        autoSpeed: 0.5,
        autoIntensity: 1.35,
        pointerDampening: 0.12,
        dpr: 1.2,
    },
};

function colorToVector(hex) {
    const color = new THREE.Color(hex);
    return new THREE.Vector3(color.r, color.g, color.b);
}

class LiquidEtherStage {
    constructor(container, options) {
        this.container = container;
        this.options = options;
        this.pointer = new THREE.Vector2(0.5, 0.5);
        this.pointerTarget = new THREE.Vector2(0.5, 0.5);
        this.autoPointer = new THREE.Vector2(0.5, 0.5);
        this.lastInteraction = performance.now();
        this.inViewport = true;
        this.gatewayHidden = false;
        this.documentHidden = document.hidden;
        this.running = false;
        this.frame = null;
        this.clock = new THREE.Clock();
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerLeave = this.onPointerLeave.bind(this);
        this.onVisibility = this.onVisibility.bind(this);
        this.animate = this.animate.bind(this);
        this.resize = this.resize.bind(this);
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();
        this.camera.position.z = 1;
        this.renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, powerPreference: 'high-performance' });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.options.dpr || 1.25));
        this.renderer.setClearColor(new THREE.Color(this.options.base), 1);
        this.renderer.domElement.className = 'liquid-ether-canvas';
        this.container.prepend(this.renderer.domElement);

        const [colorA, colorB, colorC] = this.options.colors;
        this.uniforms = {
            uResolution: { value: new THREE.Vector2(1, 1) },
            uPointer: { value: this.pointer },
            uPointerStrength: { value: 0.0 },
            uTime: { value: 0.0 },
            uColorA: { value: colorToVector(colorA) },
            uColorB: { value: colorToVector(colorB) },
            uColorC: { value: colorToVector(colorC) },
            uBase: { value: colorToVector(this.options.base) },
        };

        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms: this.uniforms,
                depthWrite: false,
                depthTest: false,
            })
        );
        this.scene.add(this.mesh);

        this.resize();
        this.resizeObserver = new ResizeObserver(this.resize);
        this.resizeObserver.observe(this.container);
        window.addEventListener('pointermove', this.onPointerMove, { passive: true });
        window.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
        document.addEventListener('visibilitychange', this.onVisibility);

        this.intersectionObserver = new IntersectionObserver((entries) => {
            this.inViewport = entries.some((entry) => entry.isIntersecting);
            this.sync();
        }, { threshold: 0.01 });
        this.intersectionObserver.observe(this.container);

        const gateway = this.container.closest('.language-gateway');
        if (gateway) {
            this.mutationObserver = new MutationObserver(() => {
                this.gatewayHidden = gateway.classList.contains('is-hidden');
                this.sync();
            });
            this.mutationObserver.observe(gateway, { attributes: true, attributeFilter: ['class'] });
            this.gatewayHidden = gateway.classList.contains('is-hidden');
        }

        this.container.classList.add('is-ready');
        this.sync();
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width));
        const height = Math.max(1, Math.floor(rect.height));
        this.renderer.setSize(width, height, false);
        this.uniforms.uResolution.value.set(width, height);
    }

    onPointerMove(event) {
        const rect = this.container.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const inside = event.clientX >= rect.left && event.clientX <= rect.right &&
            event.clientY >= rect.top && event.clientY <= rect.bottom;
        if (!inside) return;
        this.pointerTarget.set(
            (event.clientX - rect.left) / rect.width,
            1 - ((event.clientY - rect.top) / rect.height)
        );
        this.lastInteraction = performance.now();
    }

    onPointerLeave() {
        this.lastInteraction = performance.now() - 1400;
    }

    onVisibility() {
        this.documentHidden = document.hidden;
        this.sync();
    }

    updatePointer(delta) {
        const now = performance.now();
        const idle = now - this.lastInteraction > 1800;
        if (this.options.autoDemo && idle) {
            const time = now * 0.001 * this.options.autoSpeed;
            this.autoPointer.set(
                0.5 + Math.sin(time * 1.37) * 0.34 + Math.sin(time * 0.51) * 0.08,
                0.5 + Math.cos(time * 1.11) * 0.26 + Math.sin(time * 0.73) * 0.09
            );
            this.pointerTarget.lerp(this.autoPointer, 0.025);
            this.uniforms.uPointerStrength.value = THREE.MathUtils.lerp(
                this.uniforms.uPointerStrength.value,
                this.options.autoIntensity,
                0.035
            );
        } else {
            this.uniforms.uPointerStrength.value = THREE.MathUtils.lerp(
                this.uniforms.uPointerStrength.value,
                1.35,
                0.12
            );
        }

        const damp = 1 - Math.exp(-delta / Math.max(0.001, this.options.pointerDampening));
        this.pointer.lerp(this.pointerTarget, Math.min(1, damp));
    }

    animate() {
        if (!this.running) return;
        this.frame = requestAnimationFrame(this.animate);
        const delta = Math.min(0.05, this.clock.getDelta());
        this.uniforms.uTime.value += delta;
        this.updatePointer(delta);
        this.renderer.render(this.scene, this.camera);
    }

    sync() {
        const shouldRun = this.inViewport && !this.gatewayHidden && !this.documentHidden;
        if (shouldRun && !this.running) {
            this.running = true;
            this.clock.getDelta();
            this.animate();
        } else if (!shouldRun && this.running) {
            this.running = false;
            if (this.frame) cancelAnimationFrame(this.frame);
            this.frame = null;
        }
    }

    destroy() {
        this.running = false;
        if (this.frame) cancelAnimationFrame(this.frame);
        this.resizeObserver?.disconnect();
        this.intersectionObserver?.disconnect();
        this.mutationObserver?.disconnect();
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerleave', this.onPointerLeave);
        document.removeEventListener('visibilitychange', this.onVisibility);
        this.geometry?.dispose();
        this.mesh?.geometry?.dispose();
        this.mesh?.material?.dispose();
        this.renderer?.dispose();
        if (this.renderer?.domElement?.parentElement === this.container) {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

function canRenderMotion() {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initLiquidEther() {
    if (!canRenderMotion()) return;
    document.querySelectorAll('[data-liquid-ether]').forEach((container) => {
        const preset = presets[container.dataset.liquidEther];
        if (!preset) return;
        try {
            new LiquidEtherStage(container, preset);
        } catch (error) {
            container.classList.add('is-unavailable');
            console.warn('Liquid Ether background could not start.', error);
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiquidEther, { once: true });
} else {
    initLiquidEther();
}
