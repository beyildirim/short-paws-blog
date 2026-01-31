import fs from 'node:fs';
import path from 'node:path';
import { load as loadYaml } from 'js-yaml';

const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');

const errors = [];
const slugs = new Set();

if (!fs.existsSync(postsDir)) {
  console.error(`Content directory not found: ${postsDir}`);
  process.exit(1);
}

const files = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md'));

const parseFrontmatter = (raw) => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { data: {}, content: raw };
  }
  const yamlSource = match[1].trim();
  const data = loadYaml(yamlSource) || {};
  const content = raw.slice(match[0].length).trim();
  return { data, content };
};

files.forEach((file) => {
  const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
  const { data, content } = parseFrontmatter(raw);

  const title = data.title;
  const slug = data.slug || file.replace(/\.md$/, '');
  const date = data.date || data.publishedAt;
  const status = data.status || 'published';

  if (!title) errors.push(`${file}: missing title`);
  if (!date) errors.push(`${file}: missing date or publishedAt`);
  if (!content.trim()) errors.push(`${file}: empty content`);

  if (!['draft', 'scheduled', 'published'].includes(status)) {
    errors.push(`${file}: invalid status "${status}"`);
  }

  if (slugs.has(slug)) {
    errors.push(`${file}: duplicate slug "${slug}"`);
  }
  slugs.add(slug);
});

if (errors.length) {
  console.error('\nContent lint errors:');
  errors.forEach((err) => console.error(`- ${err}`));
  process.exit(1);
}

console.log(`Content lint passed (${files.length} posts).`);
