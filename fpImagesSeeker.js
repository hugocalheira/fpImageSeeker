const promises = require('fs/promises');
const fs = require('fs');
const glob = require('glob')

const fixedPath = "\\\\fsraia01\\APPS\\FPOPULAR\\DROGARAIA\\"

function mountPath({date, key}) {
    date = new Date(date).toLocaleDateString()
    const year = date.split('/')[2]
    const month = date.split('/')[1]
    const day = date.split('/')[0]
    const path = `${fixedPath}${year}\\${month}\\${day}`
    return {path, key}
}

function listAllFiles({key, path}) {
    // console.log({key, path})

    glob(`${path}\\1_${key}*.jpg`, (err, files) => {
        if (err) console.log(err)
        else console.log(files)
    })

    // fs.readdirSync(path).forEach(file => {
    //     if (file.includes(key)) {
    //         copyFile(`${path}\\${file}`, `.\\images\\${file}`)
    //     }
    // });
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