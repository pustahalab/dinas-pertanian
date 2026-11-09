const fs = require('fs');
const path = require('path');

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function compile(templateString, currentDir, viewsRoot) {
  return function render(data) {
    const context = { ...data };

    function include(relPath, customData = {}) {
      let candidate = path.join(currentDir, relPath);
      if (!path.extname(candidate)) candidate += '.ejs';

      if (!fs.existsSync(candidate) && viewsRoot) {
        // Try resolving directly under views root
        let alt = path.join(viewsRoot, relPath);
        if (!path.extname(alt)) alt += '.ejs';
        if (fs.existsSync(alt)) {
          candidate = alt;
        }
      }

      if (!fs.existsSync(candidate)) {
        throw new Error(`File template partial tidak ditemukan: ${candidate}`);
      }

      const fileContent = fs.readFileSync(candidate, 'utf-8');
      const subRender = compile(fileContent, path.dirname(candidate), viewsRoot);
      return subRender({ ...context, ...customData });
    }

    context.include = include;
    context.escapeHtml = escapeHtml;

    let jsCode = 'let __out = [];\n';
    jsCode += 'const { include, escapeHtml } = __ctx;\n';
    jsCode += 'with (__ctx) {\n';

    let cursor = 0;
    const regex = /<%([=\-_#%]?)([\s\S]*?)%>/g;
    let match;

    while ((match = regex.exec(templateString)) !== null) {
      const plainText = templateString.slice(cursor, match.index);
      if (plainText) {
        jsCode += `__out.push(${JSON.stringify(plainText)});\n`;
      }

      const modifier = match[1];
      const code = match[2].trim();

      if (modifier === '=') {
        jsCode += `__out.push(escapeHtml(${code}));\n`;
      } else if (modifier === '-') {
        jsCode += `__out.push((${code}) !== undefined && (${code}) !== null ? (${code}) : '');\n`;
      } else if (modifier === '#') {
        // Comment
      } else {
        jsCode += `${code}\n`;
      }

      cursor = match.index + match[0].length;
    }

    const remainingText = templateString.slice(cursor);
    if (remainingText) {
      jsCode += `__out.push(${JSON.stringify(remainingText)});\n`;
    }

    jsCode += '}\nreturn __out.join("");';

    try {
      const fn = new Function('__ctx', jsCode);
      return fn(context);
    } catch (err) {
      console.error('Template compilation error:', err);
      console.error('Generated JS code:\n', jsCode);
      throw err;
    }
  };
}

function expressViewEngine(filePath, options, callback) {
  try {
    const viewsRoot = options.settings ? options.settings.views : path.dirname(filePath);
    const currentDir = path.dirname(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const renderFn = compile(content, currentDir, viewsRoot);
    const rendered = renderFn(options);
    return callback(null, rendered);
  } catch (err) {
    return callback(err);
  }
}

module.exports = {
  compile,
  expressViewEngine,
  escapeHtml
};
