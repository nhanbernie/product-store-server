const { execSync } = require('child_process')
const path = require('path')

try {
  // Change to the server directory
  process.chdir(path.join(__dirname))

  // Run the seeder with production environment
  execSync('cross-env NODE_ENV=production ts-node src/modules/product/product.seeder.ts', {
    stdio: 'inherit'
  })
} catch (error) {
  console.error('Error running seeder:', error)
  process.exit(1)
}
