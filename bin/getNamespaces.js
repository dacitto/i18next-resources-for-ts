const fs = require('fs')
const path = require('path')

const getFiles = (srcpath) => {
  return fs.readdirSync(srcpath).filter((file) => {
    return !fs.statSync(path.join(srcpath, file)).isDirectory()
  }).filter((file) => path.extname(file) === '.json').map((file) => path.join(srcpath, file))
}

const getDirectories = (srcpath) => {
  return fs.readdirSync(srcpath).filter((file) => {
    return fs.statSync(path.join(srcpath, file)).isDirectory()
  }).map((dir) => path.join(srcpath, dir))
}

function getAllFiles (srcpath) {
  let files = getFiles(srcpath)
  const dirs = getDirectories(srcpath)
  dirs.forEach((dir) => {
    files = files.concat(getAllFiles(dir))
  })
  return files
}

module.exports = (p) => {
  const allFiles = getAllFiles(p)

  return allFiles.map((file) => {
    const namespace = JSON.parse(fs.readFileSync(file, 'utf-8'))
    const sepFile = file.split(path.sep)
    const fileName = sepFile[sepFile.length - 1]
    const name = path.parse(fileName).name

    return {
      name,
      path: file,
      resources: namespace
    }
  })
}
