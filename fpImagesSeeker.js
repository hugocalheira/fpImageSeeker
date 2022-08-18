const promises = require('fs/promises');
const fs = require('fs');

const fixedPath = "\\\\fsraia01\\APPS\\FPOPULAR\\DROGASIL\\"

function mountPath({date, key}) {
    date = new Date(date).toLocaleDateString()
    const year = date.split('/')[2]
    const month = date.split('/')[1]
    const day = date.split('/')[0]
    const path = `${fixedPath}${year}\\${month}\\${day}`
    return {path, key}
}

function listAllFiles({key, path}) {
    const files = fs.readdirSync(path)
    const filteredList = files.filter(file => file.includes(key))
    
    if (filteredList.length)
        filteredList.forEach(file => copyFile(`${path}\\${file}`, `.\\images\\${file}`))
}

function copyFile(source, target) {
    fs.copyFile(source, target, (err) => {
        if (err) throw err;
        console.log(`${source} was copied...`);
    });
}

async function fpImageSeeker() {
  try {
    const data = await promises.readFile('fp_autorizacao.csv', { encoding: 'utf8' });
    const lines = data.split('\n');
    lines.forEach((line, index) => {
        if (index > 0 && line.length) {
            const columns = line.split(',')
            listAllFiles(mountPath({ key: columns[1], date: columns[7] }))
        }
    })
  } catch (err) {
    console.log(err);
  }
}
fpImageSeeker();