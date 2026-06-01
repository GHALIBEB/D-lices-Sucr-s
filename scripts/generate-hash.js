const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/generate-hash.js <votre_mot_de_passe>');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log('\nAjoutez dans .env.local :');
  console.log(`ADMIN_PASSWORD_HASH="${hash}"\n`);
});
