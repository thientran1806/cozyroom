uniform float uTime;
uniform sampler2D uPerlinTexture;
varying vec2 vUv;

void main() {
    // scale and animate
    vec2 smokeUv = vUv;
    smokeUv.x *= 0.5;
    smokeUv.y += 0.3;
    smokeUv.y -= uTime * 0.03;

    // Fire
    float fire = texture2D(uPerlinTexture, vUv).r;

    // Remap
    fire = smoothstep(0.4, 1.0, fire);

    // Edges
    fire *= smoothstep(0.0, 0.1, vUv.x);
    fire *= 1.0 - smoothstep(1.0, 0.9, vUv.x);
    fire *= 1.0 - smoothstep(0.0, 0.1, vUv.y);
    fire *= 1.0 - smoothstep(1.0, 0.4, vUv.y);

    // Red fire color gradient (dark red at bottom, bright red at top)
    vec3 darkRed = vec3(0.8, 0.1, 0.1); // Dark red
    vec3 brightRed = vec3(1.0, 0.3, 0.1); // Bright red/orange
    vec3 fireColor = mix(darkRed, brightRed, vUv.y);

    // Output with red color
    gl_FragColor = vec4(fireColor, fire);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}