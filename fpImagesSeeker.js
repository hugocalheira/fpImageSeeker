const promises = require('fs/promises');
const fs = require('fs');

const fixedPath = "\\\\fsraia01\\APPS\\FPOPULAR\\DROGASIL\\"

function mountPath({key, date}) {
    // date = new Date(date).toLocaleDateString()
    // const year = date.split('/')[2]
    // const month = date.split('/')[1]
    // const day = date.split('/')[0]
    // const path = `${fixedPath}${year}\\${month}\\${day}`
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
    console.log(source)
    // fs.copyFile(source, target, (err) => {
    //     if (err) throw err;
    //     console.log(`${source} was copied...`);
    // });
}

async function keysExtractor(date) {
    try {
        const data = await promises.readFile('fp_autorizacao.csv', { encoding: 'utf8' });
        const lines = data.split('\n');
        const keys = lines.filter((line, index) => {

            if (index > 0 && line.length) {
                const columns = line.split(',')
                // listAllFiles(mountPath())
                if (columns[7].split(' ')[0] === date) {
                    return line
                }
            }
        }).map((line) => line.split(',')[1])

        return keys

    } catch (err) {
        console.log(err)
    }
}

async function datesIterator() {
    try {
      const data = await promises.readFile('paths.txt', { encoding: 'utf8' });
      const lines = data.split('\n');
      lines.forEach((line, index) => {
            // console.log(line.replaceAll('\\\\',"-"))
            const keys = keysExtractor(line.replaceAll('\\',"-"))
            
            keys.then(k => 
                k.map(key => 
                    listAllFiles(mountPath({ key, date: line }))
                )
            )

            
        //   if (index > 0 && line.length) {
        //       const columns = line.split(',')
        //       listAllFiles(mountPath({ key: columns[1], date: columns[7] }))
        //   }
      })
    //   keysExtractor()
    } catch (err) {
      console.log(err);
    }
}


// async function fpImageSeeker() {
//   try {
//     const data = await promises.readFile('fp_autorizacao.csv', { encoding: 'utf8' });
//     const lines = data.split('\n');
//     lines.forEach((line, index) => {
//         if (index > 0 && line.length) {
//             const columns = line.split(',')
//             listAllFiles(mountPath({ key: columns[1], date: columns[7] }))
//         }
//     })
//   } catch (err) {
//     console.log(err);
//   }
// }
// fpImageSeeker();
datesIterator();