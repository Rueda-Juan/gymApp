// tree.js
const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.argv[2] || process.cwd();

const VALID_EXT = new Set(['.js', '.jsx', '.ts', '.tsx']);

// Carpetas ignoradas (puedes agregar más)
const IGNORE_DIRS = new Set([
  'node_modules',
  '__tests__',
  '__mocks__',
  'Docs',
  '.git',
  'dist',
  'build',
  '.next',
  '.expo',
  'coverage',
  '.turbo',
  '.cache'
]);

function isValidFile(file) {
  return VALID_EXT.has(path.extname(file));
}

function shouldIgnore(name) {
  return IGNORE_DIRS.has(name);
}

// Cache para no recalcular (clave para rendimiento en proyectos grandes)
const hasValidCache = new Map();

// Verifica si una carpeta contiene archivos válidos en cualquier profundidad
function hasValidFiles(dir) {
  if (hasValidCache.has(dir)) return hasValidCache.get(dir);

  let result = false;

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (shouldIgnore(entry.name)) continue;

      const fullPath = path.join(dir, entry.name);

      if (entry.isFile() && isValidFile(entry.name)) {
        result = true;
        break;
      }

      if (entry.isDirectory()) {
        if (hasValidFiles(fullPath)) {
          result = true;
          break;
        }
      }
    }
  } catch (e) {
    // Permisos u otros errores → ignorar carpeta
    result = false;
  }

  hasValidCache.set(dir, result);
  return result;
}

// Acumula el resultado en un array de líneas
let outputLines = [];

function printTree(dir, prefix = '') {
  let entries = [];

  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  entries = entries
    .filter(entry => {
      if (shouldIgnore(entry.name)) return false;

      const fullPath = path.join(dir, entry.name);

      if (entry.isFile()) return isValidFile(entry.name);
      if (entry.isDirectory()) return hasValidFiles(fullPath);

      return false;
    })
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const nextPrefix = prefix + (isLast ? '    ' : '│   ');

    outputLines.push(prefix + connector + entry.name);

    if (entry.isDirectory()) {
      printTree(path.join(dir, entry.name), nextPrefix);
    }
  });
}

// Ejecutar
let entries = [];
try {
  entries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
} catch {
  entries = [];
}

// Filtrar solo carpetas válidas de primer nivel (ignorar archivos en la raíz)
entries = entries.filter(entry => {
  if (!entry.isDirectory()) return false;
  if (shouldIgnore(entry.name)) return false;
  const fullPath = path.join(ROOT_DIR, entry.name);
  return hasValidFiles(fullPath);
});

// Ordenar carpetas alfabéticamente
entries.sort((a, b) => a.name.localeCompare(b.name));

// Imprimir cada carpeta de primer nivel
entries.forEach((entry, index) => {
  const isLast = index === entries.length - 1;
  const connector = isLast ? '└── ' : '├── ';
  const nextPrefix = isLast ? '    ' : '│   ';
  outputLines.push(connector + entry.name);
  printTree(path.join(ROOT_DIR, entry.name), nextPrefix);
});

fs.writeFileSync('tree.txt', outputLines.join('\n'), 'utf8');