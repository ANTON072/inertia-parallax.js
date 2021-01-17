import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";

export default {
  input: "src/inertia-parallax.js",
  output: {
    file: "dist/inertia-parallax.js",
    format: "umd",
    name: "InertiaParallax",
  },
  plugins: [
    resolve(),
    babel({
      exclude: "node_modules/**",
      presets: [
        [
          "@babel/preset-env",
          {
            modules: false,
          },
        ],
      ],
      plugins: [
        "@babel/plugin-external-helpers",
        "@babel/plugin-proposal-class-properties",
      ],
    }),
    uglify(),
  ],
};
