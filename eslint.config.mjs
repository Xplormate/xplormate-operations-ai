import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Images are pre-sized WebP/SVG files served as-is; next/image is not used on purpose.
  { rules: { "@next/next/no-img-element": "off" } },
  globalIgnores([
    ".next/**",
    "out/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
