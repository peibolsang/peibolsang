const { get } = require('https');
const { writeFileSync, readFileSync } = require('fs');
const { format } = require('prettier');
const { stripIndent } = require('common-tags');

get('https://dev.to/api/articles?username=peibolsang', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    updateReadme(JSON.parse(data));
  });
}).on('error', (e) => {
  console.error(e);
});

function updateReadme(post) {
  const content = stripIndent`
    # ${post[0].title}
    ${post[0].description}
    [Read more](${post[0].canonical_url})
  `;
  const formatted = format(content, {
    parser: 'markdown',
  });

  let header = readFileSync('./HEADER.md');
  writeFileSync('./README.md', header+formatted);
}