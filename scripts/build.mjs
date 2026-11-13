import { access, cp, mkdir, readFile, readdir, rm } from "node:fs/promises";

const outputRoot = new URL("../dist/", import.meta.url);
const publishPaths = ["index.html", "styles.css", "explorer.css", "src"];

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

for (const path of publishPaths) {
  await cp(
    new URL("../" + path, import.meta.url),
    new URL("../dist/" + path, import.meta.url),
    { recursive: true }
  );
}

const outputHtml = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
const localHtmlReferences = [...outputHtml.matchAll(/(?:src|href)=["']\.\/([^"'#?]+)["']/g)]
  .map(match => match[1]);

for (const reference of localHtmlReferences) {
  await access(new URL("../dist/" + reference, import.meta.url));
}

async function collectFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relativePath = prefix ? prefix + "/" + entry.name : entry.name;
    if (entry.isDirectory()) {
      files.push(...await collectFiles(new URL("../dist/" + relativePath + "/", import.meta.url), relativePath));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }
  return files;
}

const outputFiles = await collectFiles(outputRoot);
const javascriptFiles = outputFiles.filter(path => path.endsWith(".js"));

for (const path of javascriptFiles) {
  const source = await readFile(new URL("../dist/" + path, import.meta.url), "utf8");
  const imports = [...source.matchAll(/\bfrom\s*["'](\.{1,2}\/[^"']+)["']/g)].map(match => match[1]);
  for (const specifier of imports) {
    const resolved = new URL(specifier, new URL("../dist/" + path, import.meta.url));
    await access(resolved);
  }
}

const requiredFiles = ["index.html", "styles.css", "explorer.css", "src/app.js", "src/content.js"];
for (const path of requiredFiles) {
  if (!outputFiles.includes(path)) {
    throw new Error("Required static build file is missing: " + path);
  }
}

console.log("Static build created: dist/ (" + outputFiles.length + " files). Local HTML assets and JavaScript imports resolved.");
