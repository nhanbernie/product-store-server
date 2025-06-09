import { execSync } from 'child_process'
import { join } from 'path'
import { fileURLToPath } from 'url'

try {
  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  // Change to the server directory
  process.chdir(join(__dirname))

  // Run the seeder with production environment
  execSync('cross-env NODE_ENV=production ts-node src/modules/product/product.seeder.ts', {
    stdio: 'inherit'
  })
} catch (error) {
  console.error('Error running seeder:', error)
  process.exit(1)
}
