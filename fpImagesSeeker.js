const promises = require('fs/promises');
const fs = require('fs');
const fixedPath = "\\\\fsraia01\\APPS\\FPOPULAR\\DROGASIL\\"

function mountPath({key, date}) {
    const path = `${fixedPath}${date}`
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

function keysExtractor(date) {
    console.log(date)
    try {
        const data = fs.readFileSync('fp_autorizacao.csv', { encoding: 'utf8' });
        const lines = data.split('\n');
        return lines.filter((line, index) => {
            if (index > 0 && line.length) {
                const columns = line.split(',')
                if (columns[7].split(' ')[0] === date) {
                    return line
                }
            }
        }).map((line) => line.split(',')[1])
    } catch (err) {
        console.log(err)
    }
}

async function datesIterator() {
    try {
      const data = await promises.readFile('paths.txt', { encoding: 'utf8' });
      const lines = data.split('\n');
      lines.forEach((line) => {
            const keys = keysExtractor(line.replaceAll('\\',"-"))
            keys.map(key => 
                listAllFiles(mountPath({ key, date: line }))
            )
      })
    } catch (err) {
      console.log(err);
    }
}

datesIterator();